export function withRequestLogging(handler, { log = console.log, now = () => performance.now() } = {}) {
	return (req, res) => {
		const start = now();
		res.on("finish", () => {
			log(`${req.method} ${req.url} ${res.statusCode} ${(now() - start).toFixed(1)}ms`);
		});
		handler(req, res);
	};
}
