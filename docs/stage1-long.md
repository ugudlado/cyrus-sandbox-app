# Stage 1: Twelve Facts About Job Queues

1. A job queue decouples the code that requests work (producers) from the code that performs it (consumers), so each side can scale and fail independently.
2. Most queues guarantee at-least-once delivery, so a job may run more than once and handlers should be idempotent.
3. A visibility timeout (or lease) hides a claimed job from other workers; if the worker does not acknowledge it before the timeout expires, the job becomes available again.
4. Retries should use exponential backoff with jitter so that a failing dependency is not hammered by synchronized retry storms.
5. A dead-letter queue collects jobs that have exceeded their maximum retry count, so poison messages stop blocking the main queue and can be inspected later.
6. Strict FIFO ordering usually limits throughput; many queues offer ordering only within a partition or message group key.
7. Backpressure keeps producers from overwhelming consumers, for example by bounding queue length or rejecting new jobs when the queue is full.
8. Delayed or scheduled jobs are typically stored with a run-at timestamp and moved to the ready queue only when that time arrives.
9. Priority queues let urgent jobs skip ahead, but without aging or fair scheduling, low-priority jobs can starve.
10. Graceful shutdown means a worker stops claiming new jobs, finishes or releases in-flight ones, and only then exits.
11. Queue depth and job age (time since enqueue) are the key health metrics; a growing oldest-job age signals that consumers are falling behind.
