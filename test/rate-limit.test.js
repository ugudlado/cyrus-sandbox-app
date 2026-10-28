import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createRateLimiter } from "../src/rate-limit.js";
import { createServer } from "../src/app.js";

function fakeReq(remoteAddress = "1.1.1.1") {
	return { socket: { remoteAddress } };
}

function fakeRes() {
	return {
		writeHead(status, headers) {
			this.statusCode = status;
			this.headers = headers;
		},
		end(body) {
			this.body = body;
		},
	};
}

test("allows exactly `limit` requests then 429s", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 10_000, limit: 3, now: () => t });
	const req = fakeReq();

	assert.equal(limiter(req, fakeRes()), true);
	assert.equal(limiter(req, fakeRes()), true);
	assert.equal(limiter(req, fakeRes()), true);

	const res = fakeRes();
	assert.equal(limiter(req, res), false);
	assert.equal(res.statusCode, 429);
	assert.deepEqual(JSON.parse(res.body), { error: "too many requests" });
});

test("Retry-After header value is correct given elapsed time", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 10_000, limit: 1, now: () => t });
	const req = fakeReq();

	limiter(req, fakeRes());

	t = 3000;
	const res = fakeRes();
	limiter(req, res);
	assert.equal(res.headers["retry-after"], "7");
});

test("Retry-After rounds up and is at least 1 near the end of the window", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 10_000, limit: 1, now: () => t });
	const req = fakeReq();

	limiter(req, fakeRes());

	t = 9999;
	const res = fakeRes();
	limiter(req, res);
	assert.equal(res.headers["retry-after"], "1");
});

test("429 response has json content-type", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 10_000, limit: 0, now: () => t });
	const req = fakeReq();

	const res = fakeRes();
	limiter(req, res);
	assert.equal(res.headers["content-type"], "application/json");
});

test("window resets after windowMs elapses, restarting the count", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 1000, limit: 1, now: () => t });
	const req = fakeReq();

	assert.equal(limiter(req, fakeRes()), true);
	assert.equal(limiter(req, fakeRes()), false);

	t = 1000;
	assert.equal(limiter(req, fakeRes()), true);
	assert.equal(limiter(req, fakeRes()), false);
});

test("per-IP isolation: separate budgets for different remote addresses", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 1000, limit: 1, now: () => t });
	const reqA = fakeReq("1.1.1.1");
	const reqB = fakeReq("2.2.2.2");

	assert.equal(limiter(reqA, fakeRes()), true);
	assert.equal(limiter(reqA, fakeRes()), false);
	assert.equal(limiter(reqB, fakeRes()), true);
	assert.equal(limiter(reqB, fakeRes()), false);
});

test("limit 0 blocks everything", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 1000, limit: 0, now: () => t });
	const req = fakeReq();

	const res = fakeRes();
	assert.equal(limiter(req, res), false);
	assert.equal(res.statusCode, 429);
});

test("requests missing socket.remoteAddress are grouped under 'unknown'", () => {
	let t = 0;
	const limiter = createRateLimiter({ windowMs: 1000, limit: 1, now: () => t });

	assert.equal(limiter({ socket: {} }, fakeRes()), true);
	assert.equal(limiter({ socket: {} }, fakeRes()), false);
});

test("throws RangeError for invalid windowMs", () => {
	assert.throws(() => createRateLimiter({ windowMs: 0 }), RangeError);
	assert.throws(() => createRateLimiter({ windowMs: NaN }), RangeError);
	assert.throws(() => createRateLimiter({ windowMs: -5 }), RangeError);
	assert.throws(() => createRateLimiter({ windowMs: Infinity }), RangeError);
});

test("throws RangeError for invalid limit", () => {
	assert.throws(() => createRateLimiter({ limit: NaN }), RangeError);
	assert.throws(() => createRateLimiter({ limit: -1 }), RangeError);
	assert.throws(() => createRateLimiter({ limit: 1.5 }), RangeError);
});

test("default options construct a working limiter", () => {
	const limiter = createRateLimiter();
	assert.equal(limiter(fakeReq(), fakeRes()), true);
});

let server;
let base;
let t = 0;

before(async () => {
	server = createServer({ limit: 2, windowMs: 1000, now: () => t });
	await new Promise((resolve) => server.listen(0, resolve));
	base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
	server.closeAllConnections();
	server.close();
});

test("integration: per-IP budget is shared across every endpoint", async () => {
	const first = await fetch(`${base}/ping`);
	assert.equal(first.status, 200);

	const second = await fetch(`${base}/hello`);
	assert.equal(second.status, 200);

	const third = await fetch(`${base}/nope`);
	assert.equal(third.status, 429);
	assert.equal(third.headers.get("content-type"), "application/json");
	assert.ok(third.headers.has("retry-after"));
	assert.deepEqual(await third.json(), { error: "too many requests" });
});

test("integration: allowed again after the window advances", async () => {
	t += 1000;
	const res = await fetch(`${base}/`);
	assert.equal(res.status, 200);
});
