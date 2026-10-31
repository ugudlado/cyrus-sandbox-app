# Queue facts

1. A queue is a first-in, first-out (FIFO) data structure: the first element added is the first one removed.
2. The two core queue operations are enqueue, which adds an element at the back, and dequeue, which removes the element at the front.
3. With a linked list or a circular buffer, enqueue and dequeue both run in O(1) time.
4. A circular buffer (ring buffer) stores a bounded queue in a fixed-size array whose head and tail indices wrap around to the start.
5. A double-ended queue (deque) allows insertion and removal at both the front and the back.
6. A priority queue dequeues the element with the highest priority rather than the oldest one, and is commonly backed by a binary heap.
7. Breadth-first search uses a queue to visit graph nodes in order of their distance from the start node.
8. Operating system schedulers keep runnable processes in ready queues; round-robin scheduling cycles through one such queue.
9. Message queues such as RabbitMQ and Amazon SQS decouple producers from consumers so each side can run and scale independently.
10. A dead-letter queue holds messages that could not be processed after a set number of attempts, so they can be inspected later.
11. A queue can be built from two stacks: push onto an inbox stack, and pop from an outbox stack, refilling it from the inbox only when it is empty, giving amortized O(1) operations.
12. Little's Law states that the average number of items in a stable queueing system equals the arrival rate multiplied by the average time an item spends in the system (L = λW).
