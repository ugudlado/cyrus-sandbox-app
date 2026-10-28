import { createServer } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
createServer({
	windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
	limit: Number(process.env.RATE_LIMIT_MAX ?? 100),
}).listen(port, () => {
	console.log(`listening on ${port}`);
});
