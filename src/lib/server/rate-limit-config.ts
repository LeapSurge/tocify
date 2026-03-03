interface RateLimitEnvLike {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
}

export interface RateLimitConfig {
  enabled: boolean;
  url?: string;
  token?: string;
}

export function resolveRateLimitConfig(envLike: RateLimitEnvLike): RateLimitConfig {
  const url = envLike.UPSTASH_REDIS_REST_URL?.trim();
  const token = envLike.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return { enabled: false };
  }

  return {
    enabled: true,
    url,
    token,
  };
}
