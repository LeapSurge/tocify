import { describe, expect, it } from 'vitest';

import { getFriendlyAiErrorMessage, parseJsonText } from './toc-response';

describe('parseJsonText', () => {
  it('throws readable error for non-json payload', () => {
    expect(() => parseJsonText('forbidden', '/api/process-toc')).toThrow(/Invalid JSON response/);
  });

  it('parses valid json payload', () => {
    expect(parseJsonText('[1,2,3]', '/api/process-toc')).toEqual([1, 2, 3]);
  });
});

describe('getFriendlyAiErrorMessage', () => {
  it('maps 5xx to provider-prefixed message', () => {
    const msg = getFriendlyAiErrorMessage(500, 'Internal Error', 'gemini');
    expect(msg).toContain('Gemini:');
  });

  it('maps to-range parsing hints', () => {
    const msg = getFriendlyAiErrorMessage(422, 'No valid ToC structure found', 'gemini');
    expect(msg).toContain('selected pages');
  });
});
