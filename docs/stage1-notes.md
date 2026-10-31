# Stage 1 notes: what a job runner does

- **Claim:** atomically takes ownership of a queued job so no other worker runs it at the same time.
- **Heartbeat:** periodically renews its lease while working, so a crashed worker's job can be detected and reclaimed.
- **Replay:** on restart, picks up a reclaimed job from its last recorded step instead of starting over, so work isn't lost or duplicated.
