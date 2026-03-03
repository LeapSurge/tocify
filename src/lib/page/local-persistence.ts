import type { TocItem } from '$lib/pdf-service';

export interface TocDraftPayload {
  items: TocItem[];
  pageOffset: number;
}

export function writeFingerprint(storage: Storage, fingerprint: string): void {
  storage.setItem('tocify_last_fingerprint', fingerprint);
}

export function readDraft(storage: Storage, fingerprint: string): TocDraftPayload | null {
  const session = storage.getItem(`toc_draft_${fingerprint}`);
  if (!session) return null;

  try {
    return JSON.parse(session) as TocDraftPayload;
  } catch {
    return null;
  }
}

export function getHintVisibility(storage: Storage, nowMs: number): boolean {
  const hideHintUntil = storage.getItem('tocify_hide_next_step_hint_until');
  if (!hideHintUntil) return true;

  const expiry = Number.parseInt(hideHintUntil, 10);
  if (Number.isNaN(expiry)) return true;

  return nowMs >= expiry;
}

export function shouldShowGraphEntrance(storage: Storage, nowMs: number): boolean {
  const hideUntil = storage.getItem('tocify_hide_graph_entrance_until');
  if (!hideUntil) return true;

  const expiry = Number.parseInt(hideUntil, 10);
  if (Number.isNaN(expiry)) return true;

  if (nowMs < expiry) {
    return false;
  }

  storage.removeItem('tocify_hide_graph_entrance_until');
  return true;
}
