import { describe, expect, it } from 'vitest';

import { buildTocAfterOffset } from './toc-offset';

describe('buildTocAfterOffset', () => {
  it('adds root when first item is not contents-like title', () => {
    const items = buildTocAfterOffset(
      [{ id: '1', title: 'Chapter 1', to: 10, children: [] } as any],
      3,
      2
    );

    expect(items[0].title).toBe('Contents');
    expect(items[1].title).toBe('Chapter 1');
  });

  it('does not add root when first item is contents', () => {
    const items = buildTocAfterOffset(
      [{ id: '1', title: 'Contents', to: 10, children: [] } as any],
      3,
      2
    );

    expect(items).toHaveLength(1);
  });
});
