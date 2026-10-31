# Stage 1 notes: what a job runner does

- **Claim:** atomically takes ownership of a queued job so no other worker runs it at the same time.
- **Heartbeat:** periodically renews its lease while working, so a crashed worker's job can be detected and reclaimed.
- **Replay:** on restart, picks up a reclaimed job from its last recorded step instead of starting over, so work isn't lost or duplicated.
- **Report:** records the job's outcome (success, failure, and any output or error) so callers and operators can see what happened.
- **Retry:** re-queues a failed job with backoff, up to a set limit, before marking it permanently failed.
