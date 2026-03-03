import type { TocItem } from '$lib/pdf-service';

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

export function buildTocAfterOffset(
  pendingTocItems: TocItem[],
  firstRangeStart: number,
  offset: number
): TocItem[] {
  const nextItems = [...pendingTocItems];
  const containsChinese = nextItems.some((item) => hasChinese(item.title));
  const rootTitle = containsChinese ? '目录' : 'Contents';
  const firstTitleNormalized = nextItems[0]?.title?.trim().toLowerCase();

  const isDuplicate =
    firstTitleNormalized === '目录' ||
    firstTitleNormalized === 'contents' ||
    firstTitleNormalized === 'table of contents';

  if (!isDuplicate) {
    const rootNode: TocItem = {
      id: `root-${Date.now()}`,
      title: rootTitle,
      to: firstRangeStart - offset,
      children: [],
      open: true,
    };
    nextItems.unshift(rootNode);
  }

  return nextItems;
}
