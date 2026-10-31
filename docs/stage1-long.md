# Stage 1: Twelve Facts About Job Queues

1. A job queue decouples the code that requests work (producers) from the code that performs it (consumers), so each side can scale and fail independently.
2. Most queues guarantee at-least-once delivery, so a job may run more than once and handlers should be idempotent.
