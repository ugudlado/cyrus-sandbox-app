import http from "node:http";
import { withRequestLogging } from "./logger.js";

export function handle(req, res) {
	if (req.method === "GET" && req.url === "/") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ name: "cyrus-sandbox-app" }));
		return;
	}
	if (req.method === "GET" && req.url === "/health") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ status: "ok", ok: true }));
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
	if (req.method === "GET" && req.url === "/version") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify({ version: "0.1.2" }));
		return;
	}
	res.writeHead(404, { "content-type": "application/json" });
	res.end(JSON.stringify({ error: "not found" }));
}

export function createServer({ log } = {}) {
	return http.createServer(withRequestLogging(handle, { log }));
}
