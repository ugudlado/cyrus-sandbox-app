import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { after, before, test } from "node:test";
import { createServer } from "../src/app.js";
import { withRequestLogging } from "../src/logger.js";

test("logs method, path, status and duration for a request", () => {
	const lines = [];
	const req = { method: "GET", url: "/ping" };
	const res = new EventEmitter();
	res.statusCode = 200;

	let calls = 0;
	const now = () => (calls++ === 0 ? 0 : 5);

	let handlerCalledWith;
	const handler = (req, res) => {
		handlerCalledWith = [req, res];
	};

	const wrapped = withRequestLogging(handler, { log: (line) => lines.push(line), now });
	wrapped(req, res);
	res.emit("finish");

	assert.deepEqual(lines, ["GET /ping 200 5.0ms"]);
	assert.deepEqual(handlerCalledWith, [req, res]);
});

let server;
let base;
let lines;

before(async () => {
	lines = [];
	server = createServer({ log: (line) => lines.push(line) });
	await new Promise((resolve) => server.listen(0, resolve));
	base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
	server.closeAllConnections();
	server.close();
});

test("logs requests made against a real server", async () => {
	const pingRes = await fetch(`${base}/ping`);
	await pingRes.text();
	const nopeRes = await fetch(`${base}/nope`);
	await nopeRes.text();

	const pingPattern = /^GET \/ping 200 \d+\.\dms$/;
	const nopePattern = /^GET \/nope 404 \d+\.\dms$/;

	for (let i = 0; i < 20; i++) {
		if (lines.some((line) => pingPattern.test(line)) && lines.some((line) => nopePattern.test(line))) {
			break;
		}
		await new Promise((resolve) => setImmediate(resolve));
	}

	assert.ok(lines.some((line) => pingPattern.test(line)), `expected a line matching ${pingPattern} in ${JSON.stringify(lines)}`);
	assert.ok(lines.some((line) => nopePattern.test(line)), `expected a line matching ${nopePattern} in ${JSON.stringify(lines)}`);
});
