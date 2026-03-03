import { describe, expect, it } from 'vitest';

import { LruRenderCache } from './render-cache';

describe('LruRenderCache', () => {
  it('evicts least recently used key when over capacity', () => {
    const cache = new LruRenderCache<number>(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);

    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
    expect(cache.has('c')).toBe(true);
  });
});
