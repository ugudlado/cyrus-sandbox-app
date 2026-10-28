# cyrus-sandbox-app

A tiny Node HTTP app used only to test a self-hosted Cyrus. It is the one repository the test GitHub token may write to.

```sh
npm test     # node --test, no dependencies
npm start    # PORT=3000 by default
```

There is no CI on purpose: tests run locally and in Cyrus worktrees.

## Rate limiting

Every endpoint is protected by an in-memory, per-IP fixed-window rate
limiter. By default each client (identified by its socket remote address)
may make 100 requests per 60000 ms window. Requests beyond the limit get a
`429` response with a JSON body `{"error":"too many requests"}` and a
`Retry-After` header (in seconds) telling the client how long to wait.

Configure the defaults via environment variables when starting the server:

```sh
RATE_LIMIT_MAX=50 RATE_LIMIT_WINDOW_MS=30000 npm start
```

Or pass options directly to `createServer({ limit, windowMs })` when
embedding the app.

Caveats:

- The limiter is in-memory and per-process: state is not shared across
  multiple server instances and resets whenever the process restarts.
- Clients are identified by `req.socket.remoteAddress`. If the app runs
  behind a reverse proxy, every client arrives from the same address, so
  they share a single rate-limit bucket. This is deliberate: the limiter
  does not trust `X-Forwarded-For` or similar headers, since they can be
  spoofed by the client.
