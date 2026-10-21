import http from "node:http";

export function handle(req, res) {
	if (req.method === "GET" && req.url === "/") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ name: "cyrus-sandbox-app" }));
		return;
	}
	if (req.method === "GET" && req.url === "/health") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ status: "ok" }));
		return;
	}
	if (req.method === "GET" && req.url === "/ping") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ pong: true }));
		return;
	}
	if (req.method === "GET" && req.url === "/hello") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ hello: "world" }));
		return;
	}
	if (req.method === "GET" && req.url === "/status") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ ok: true }));
		return;
	}
	res.writeHead(404, { "content-type": "application/json" });
	res.end(JSON.stringify({ error: "not found" }));
}

export function createServer() {
	return http.createServer(handle);
}
