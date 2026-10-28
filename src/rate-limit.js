// Threshold at which the entry map is pruned of expired windows on insert.
// Keeps memory bounded without needing a background timer.
const PRUNE_THRESHOLD = 1000;

export function createRateLimiter({ windowMs = 60_000, limit = 100, now = Date.now } = {}) {
	if (!(Number.isFinite(windowMs) && windowMs > 0)) {
		throw new RangeError("windowMs must be a finite number greater than 0");
	}
	if (!(Number.isInteger(limit) && limit >= 0)) {
		throw new RangeError("limit must be a non-negative integer");
	}

	const entries = new Map();

	function pruneExpired(currentTime) {
		for (const [key, entry] of entries) {
			if (currentTime >= entry.resetAt) {
				entries.delete(key);
			}
		}
	}

	return function check(req, res) {
		const key = req.socket?.remoteAddress ?? "unknown";
		const currentTime = now();

		let entry = entries.get(key);
		if (!entry || currentTime >= entry.resetAt) {
			entry = { count: 0, resetAt: currentTime + windowMs };
			// Only prune when inserting a fresh entry and the map has grown
			// large, to avoid scanning on every request.
			if (!entries.has(key) && entries.size >= PRUNE_THRESHOLD) {
				pruneExpired(currentTime);
			}
			entries.set(key, entry);
		}

		entry.count += 1;

		if (entry.count > limit) {
			const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000));
			res.writeHead(429, {
				"content-type": "application/json",
				"retry-after": String(retryAfterSeconds),
			});
			res.end(JSON.stringify({ error: "too many requests" }));
			return false;
		}

		return true;
	};
}
