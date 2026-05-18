import type { Language } from "./i18n";

type PublishStatus = "draft" | "published";

export type LocalizedContentEntry = {
  slug: string;
  data: {
    date: Date;
    language: Language;
    status: PublishStatus;
  };
};

export function getContentSlug(id: string): string {
  return id.replace(/\.(zh|en)(?:\.(md|mdx))?$/, "");
}

export function getPublishedEntriesForLanguage<TEntry extends LocalizedContentEntry>(
  entries: TEntry[],
  language: Language,
): TEntry[] {
  return entries
    .filter((entry) => entry.data.language === language)
    .filter((entry) => entry.data.status === "published")
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
