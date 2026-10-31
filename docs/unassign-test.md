# Twelve facts about caches

1. A cache stores copies of data closer to where it is used, so later reads avoid slower trips to the original source.
2. A cache hit means the requested data was found in the cache; a cache miss means it had to be fetched from the backing store.
3. The hit ratio (hits divided by total lookups) is the main measure of how effective a cache is.
4. CPU caches are organised in levels (L1, L2, L3), where L1 is the smallest and fastest and L3 is the largest and slowest.
5. Caches exploit temporal locality (recently used data is likely to be used again) and spatial locality (nearby data is likely to be used soon).
