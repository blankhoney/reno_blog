import type { Language } from "./i18n";

export type ReaderHeading = {
  depth: number;
  slug: string;
  text: string;
};

export type ReaderNavEntry = {
  slug: string;
  title: string;
};

export function calculateReadingTime(content: string, language: Language): number {
  const normalized = content.trim();
  if (normalized.length === 0) {
    return 1;
  }

  if (language === "zh") {
    const cjkCharacters = normalized.match(/[\u3400-\u9fff]/g)?.length ?? 0;
    return Math.max(1, Math.ceil(cjkCharacters / 500));
  }

  const words = normalized.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 260));
}

export function formatReadingTime(minutes: number, language: Language): string {
  return language === "zh" ? `${minutes} 分钟阅读` : `${minutes} min read`;
}

export function shouldShowTableOfContents(headings: ReaderHeading[]): boolean {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3).length >= 2;
}

export function getAdjacentReaderEntries<TEntry extends ReaderNavEntry>(
  entries: TEntry[],
  currentSlug: string,
): { previous?: TEntry; next?: TEntry } {
  const currentIndex = entries.findIndex((entry) => entry.slug === currentSlug);
  if (currentIndex === -1) {
    return {};
  }

  return {
    previous: entries[currentIndex - 1],
    next: entries[currentIndex + 1],
  };
}

