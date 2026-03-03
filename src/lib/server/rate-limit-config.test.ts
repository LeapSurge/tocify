import { describe, expect, it } from 'vitest';

import { resolveRateLimitConfig } from './rate-limit-config';

describe('resolveRateLimitConfig', () => {
  it('disables rate limit when env is missing', () => {
    const config = resolveRateLimitConfig({
      UPSTASH_REDIS_REST_URL: '',
      UPSTASH_REDIS_REST_TOKEN: '',
    });

    expect(config.enabled).toBe(false);
  });

  it('enables rate limit when env is set', () => {
    const config = resolveRateLimitConfig({
      UPSTASH_REDIS_REST_URL: 'https://x.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: 'token',
    });

    expect(config.enabled).toBe(true);
    expect(config.url).toBe('https://x.upstash.io');
  });
});
