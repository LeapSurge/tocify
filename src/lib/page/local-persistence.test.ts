import { describe, expect, it } from 'vitest';

import { getHintVisibility, readDraft, writeFingerprint } from './local-persistence';

function makeStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  };
}

describe('local-persistence', () => {
  it('stores fingerprint key', () => {
    const storage = makeStorage();
    writeFingerprint(storage as any, 'f-1');
    expect(storage.getItem('tocify_last_fingerprint')).toBe('f-1');
  });

  it('reads draft payload safely', () => {
    const storage = makeStorage();
    storage.setItem('toc_draft_x', JSON.stringify({ items: [1], pageOffset: 2 }));
    expect(readDraft(storage as any, 'x')).toEqual({ items: [1], pageOffset: 2 });
  });

  it('handles next-step hint expiry', () => {
    const storage = makeStorage();
    storage.setItem('tocify_hide_next_step_hint_until', String(Date.now() + 10000));
    expect(getHintVisibility(storage as any, Date.now())).toBe(false);
  });
});
