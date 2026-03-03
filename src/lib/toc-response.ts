export function parseJsonText<T = any>(raw: string, source: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Invalid JSON response from ${source}: ${raw.slice(0, 120)}`);
  }
}

export function getFriendlyAiErrorMessage(
  status: number,
  message: string,
  provider?: string
): string {
  let friendlyMessage = message || 'AI processing failed.';

  if (status >= 500 && status < 600) {
    const p = provider || 'Unknown Provider';
    const providerName = p.charAt(0).toUpperCase() + p.slice(1);
    friendlyMessage = `${providerName}: ${friendlyMessage} You can try other model in API settings.`;
  } else if (
    friendlyMessage.includes('No valid ToC') ||
    friendlyMessage.includes('parsing error') ||
    friendlyMessage.includes('structure')
  ) {
    friendlyMessage = 'The selected pages don\'t look like a ToC. Please try adjusting the page range.';
  } else if (status === 413) {
    friendlyMessage = 'Request too large. Please reduce the page range or lower the resolution.';
  } else if (status === 429) {
    friendlyMessage =
      'Daily limit exceeded. Please try again tomorrow or download the client or deploy service with your own API key.';
  }

  return friendlyMessage;
}
