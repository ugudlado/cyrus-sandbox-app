import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "../src/app.js";

let server;
let base;

before(async () => {
	server = createServer();
	await new Promise((resolve) => server.listen(0, resolve));
	base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
	server.closeAllConnections();
	server.close();
});

test("GET / returns the app name", async () => {
	const res = await fetch(`${base}/`);
	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { name: "cyrus-sandbox-app" });
});

test("GET /health returns ok", async () => {
	const res = await fetch(`${base}/health`);
	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { status: "ok" });
});

test("GET /ping returns pong", async () => {
	const res = await fetch(`${base}/ping`);
	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { pong: true });
});

test("GET /hello returns world", async () => {
	const res = await fetch(`${base}/hello`);
	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { hello: "world" });
});

test("GET /status returns ok true", async () => {
	const res = await fetch(`${base}/status`);
	assert.equal(res.status, 200);
	assert.match(res.headers.get("content-type"), /application\/json/);
	assert.deepEqual(await res.json(), { ok: true });
});

test("unknown path returns 404", async () => {
	const res = await fetch(`${base}/nope`);
	assert.equal(res.status, 404);
});
