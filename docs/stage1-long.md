# Stage 1: Twelve Facts About Job Queues

1. A job queue decouples the code that requests work (producers) from the code that performs it (consumers), so each side can scale and fail independently.
2. Most queues guarantee at-least-once delivery, so a job may run more than once and handlers should be idempotent.
3. A visibility timeout (or lease) hides a claimed job from other workers; if the worker does not acknowledge it before the timeout expires, the job becomes available again.
4. Retries should use exponential backoff with jitter so that a failing dependency is not hammered by synchronized retry storms.
5. A dead-letter queue collects jobs that have exceeded their maximum retry count, so poison messages stop blocking the main queue and can be inspected later.
