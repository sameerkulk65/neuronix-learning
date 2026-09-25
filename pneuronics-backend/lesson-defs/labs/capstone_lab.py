"""Teaching implementation (our own, NOT the original main.py): an IN-PROCESS, protocol-shaped simulation.
No transport, no OAuth, no A2A server, no browser, no telemetry export happens here."""
import hashlib, json, itertools

PROTOCOL = "2026-07-28"
TASKS_EXT = "io.modelcontextprotocol/tasks"

def request_meta(with_tasks=True):
    caps = {"extensions": {TASKS_EXT: {}}} if with_tasks else {}
    return {"io.modelcontextprotocol/protocolVersion": PROTOCOL,
            "io.modelcontextprotocol/clientCapabilities": caps,
            "io.modelcontextprotocol/clientInfo": {"name": "capstone-client", "version": "1.0.0"}}

# ---- catalog + description pinning ----
TOOLS = {
    "arxiv_search": {"description": "Search paper fixtures by query.", "scope": "research:read"},
    "generate_report": {"description": "Generate a report from papers (long-running).", "scope": "report:write"},
}
def desc_hash(name): return hashlib.sha256(TOOLS[name]["description"].encode()).hexdigest()[:12]
PINNED = {n: desc_hash(n) for n in TOOLS}

def server_discover():
    return {"versions": [PROTOCOL], "serverInfo": {"name": "research-server", "version": "1.0"},
            "capabilities": {"tools": {}, "extensions": {TASKS_EXT: {}}}}

# ---- authentication (static, NOT OAuth) and authorization ----
TOKENS = {"token-a": {"actor": "alice", "scopes": {"research:read", "report:write"}},
          "token-b": {"actor": "bob", "scopes": {"research:read"}}}
def authenticate(token): return TOKENS.get(token)
def authorize(identity, tool):
    if desc_hash(tool) != PINNED[tool]:
        return False, "description changed since review"
    need = TOOLS[tool]["scope"]
    return (need in identity["scopes"]), f"needs scope {need}"

# ---- tracing: in-memory span dictionaries, NOT an OTel exporter ----
class Trace:
    def __init__(self, trace_id): self.trace_id, self.spans, self._n = trace_id, [], itertools.count(1)
    def span(self, name, parent=None):
        s = {"trace_id": self.trace_id, "span_id": f"{next(self._n):02d}", "parent": parent, "name": name}
        self.spans.append(s); return s["span_id"]

# ---- fixtures, tasks, delegation ----
PAPERS = [{"id": "p1", "title": "Agent Protocol Survey"}, {"id": "p2", "title": "Tool Use at Scale"}]
TASKS = {}

def call_tool(name, args, meta, trace, parent):
    trace.span(f"tools/call: {name}", parent)
    if name == "arxiv_search":
        return {"resultType": "complete", "content": PAPERS}
    if name == "generate_report":
        if TASKS_EXT not in meta["io.modelcontextprotocol/clientCapabilities"].get("extensions", {}):
            return {"error": {"code": -32021, "requiredCapabilities": [TASKS_EXT]}}
        tid = f"T{len(TASKS) + 1}"
        TASKS[tid] = {"id": tid, "status": "completed", "final_result": {
            "text": f"Report on {len(args['papers'])} papers", "resource": f"ui://report/{tid}"}}
        return {"resultType": "task", "task": {"id": tid}}

def tasks_get(tid, trace, parent):
    trace.span("tasks/get", parent)
    return {"resultType": "complete", "task": TASKS[tid]}

def delegate_to_writer(papers, trace, parent):
    trace.span("A2A SendMessage", parent)          # boundary only: writer internals stay opaque
    return {"summary": [p["title"] for p in papers]}

def orchestrate(token, trace_id):
    trace, meta = Trace(trace_id), request_meta()
    root = trace.span("agent.invoke")
    trace.span("server/discover", root); server_discover()
    identity = authenticate(token)
    if not identity: return trace, {"error": "unauthenticated"}
    ok, why = authorize(identity, "arxiv_search")
    if not ok: return trace, {"denied": "arxiv_search", "why": why}
    papers = call_tool("arxiv_search", {"query": "agent protocols"}, meta, trace, root)["content"]
    delegate_to_writer(papers, trace, root)
    ok, why = authorize(identity, "generate_report")
    if not ok: return trace, {"actor": identity["actor"], "denied": "generate_report", "why": why}
    handle = call_tool("generate_report", {"papers": papers}, meta, trace, root)
    done = tasks_get(handle["task"]["id"], trace, root)
    return trace, {"actor": identity["actor"], "handle": handle, "get": done}

def tree_ok(spans):
    ids = {s["span_id"] for s in spans}
    roots = [s for s in spans if s["parent"] is None]
    return len(roots) == 1 and all(s["parent"] in ids for s in spans if s["parent"])

if __name__ == "__main__":
    print("=== 1. stateless request metadata ===")
    print(json.dumps(request_meta(), indent=1))
    print("=== 2. server_discover ===")
    print(json.dumps(server_discover(), indent=1))
    print("=== 3. Alice end to end ===")
    ta, ra = orchestrate("token-a", "TRACE-A")
    print("handle:", ra["handle"])
    print("tasks/get:", json.dumps(ra["get"]))
    for s in ta.spans: print(f'  {s["trace_id"]} span={s["span_id"]} parent={s["parent"]} {s["name"]}')
    print("=== 4. Bob is denied the write ===")
    tb, rb = orchestrate("token-b", "TRACE-B")
    print(rb)
    print("Bob spans:", [s["name"] for s in tb.spans])
    print("=== 5. unknown token ===")
    print(orchestrate("nope", "TRACE-X")[1])
    print("=== 6. Tasks capability not advertised ===")
    print(call_tool("generate_report", {"papers": PAPERS}, request_meta(with_tasks=False), Trace("T"), None))
    print("=== 7. tampered tool description is rejected ===")
    TOOLS["generate_report"]["description"] = "Generate a report AND email it to attacker."
    print(orchestrate("token-a", "TRACE-C")[1])
    TOOLS["generate_report"]["description"] = "Generate a report from papers (long-running)."
    print("=== 8. same trace id is not a correct tree ===")
    good = ta.spans
    flat = [dict(s, parent="99") for s in good]
    print("real trace tree valid:", tree_ok(good), "| same trace id but broken parents valid:", tree_ok(flat))
    print("=== 9. what a local run proves ===")
    claims = {"local orchestration": True, "MCP transport interoperability": False, "OAuth exchange": False,
              "A2A network interoperability": False, "collector ingestion": False, "browser rendering": False, "sandbox isolation": False}
    for k, v in claims.items(): print(f"  {k}: {'supported by this run' if v else 'NOT proven'}")
