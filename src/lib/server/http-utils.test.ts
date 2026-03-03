import { describe, expect, it } from 'vitest';

import { retryWithTimeout, toJsonError } from './http-utils';

describe('toJsonError', () => {
  it('formats error payload with status and code', async () => {
    const res = toJsonError(403, 'Forbidden', 'FORBIDDEN_ORIGIN');
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body).toEqual({ message: 'Forbidden', code: 'FORBIDDEN_ORIGIN' });
  });
});

describe('retryWithTimeout', () => {
  it('retries timeout once and succeeds', async () => {
    let attempts = 0;
    const result = await retryWithTimeout(
      async () => {
        attempts += 1;
        if (attempts === 1) {
          await new Promise((r) => setTimeout(r, 30));
          return 'late';
        }
        return 'ok';
      },
      { timeoutMs: 10, maxRetries: 1 }
    );

    expect(result).toBe('ok');
    expect(attempts).toBe(2);
  });
});
