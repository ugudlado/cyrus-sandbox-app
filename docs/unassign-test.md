# Twelve facts about caches

1. A cache stores copies of data closer to where it is used, so later reads avoid slower trips to the original source.
2. A cache hit means the requested data was found in the cache; a cache miss means it had to be fetched from the backing store.
3. The hit ratio (hits divided by total lookups) is the main measure of how effective a cache is.
4. CPU caches are organised in levels (L1, L2, L3), where L1 is the smallest and fastest and L3 is the largest and slowest.
5. Caches exploit temporal locality (recently used data is likely to be used again) and spatial locality (nearby data is likely to be used soon).
6. LRU (least recently used) eviction removes the entry that has gone unused the longest when the cache is full.
7. A write-through cache writes to the cache and the backing store at the same time, which keeps them consistent at the cost of write latency.
8. A write-back cache writes only to the cache and flushes dirty entries to the backing store later, which speeds up writes but risks data loss on failure.
9. A TTL (time to live) expires cache entries after a fixed period so stale data is eventually refreshed.
10. Cache invalidation, deciding when cached data is no longer valid, is famously one of the hard problems in computer science.
11. A cache stampede happens when many requests miss on the same expired key at once and all hit the backing store together.
