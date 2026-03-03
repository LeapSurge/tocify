import { json } from '@sveltejs/kit';

interface RetryOptions {
  timeoutMs: number;
  maxRetries: number;
  shouldRetry?: (error: unknown) => boolean;
}

export function toJsonError(status: number, message: string, code: string) {
  return json({ message, code }, { status });
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === 'TimeoutError';
}

async function withTimeout<T>(promiseFactory: () => Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const timeoutError = new Error(`Timed out after ${timeoutMs}ms`);
      timeoutError.name = 'TimeoutError';
      reject(timeoutError);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promiseFactory(), timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function retryWithTimeout<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const shouldRetry = options.shouldRetry || isTimeoutError;

  let lastError: unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await withTimeout(operation, options.timeoutMs);
    } catch (error) {
      lastError = error;
      if (attempt === options.maxRetries || !shouldRetry(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}
