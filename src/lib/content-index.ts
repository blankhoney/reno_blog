import type { Language } from "./i18n";
import { getLocalizedPath } from "./i18n";
import type { ContentSection } from "./sections";

type PublishStatus = "draft" | "published";

export type ContentIndexEntry = {
  data: {
    date: Date;
    language: Language;
    name?: string;
    status: PublishStatus;
    summary?: string;
    tags?: string[];
    title?: string;
    translationKey: string;
  };
};

export type ContentIndexSource = {
  section: ContentSection;
  entries: ContentIndexEntry[];
};

export type ContentIndexItem = {
  date: string;
  language: Language;
  section: ContentSection;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
  url: string;
};

export function buildContentIndex(sources: ContentIndexSource[]): ContentIndexItem[] {
  return sources
    .flatMap(({ section, entries }) =>
      entries
        .filter((entry) => entry.data.status === "published")
        .map((entry) => {
          const slug = entry.data.translationKey;

          return {
            date: entry.data.date.toISOString().slice(0, 10),
            language: entry.data.language,
            section,
            slug,
            summary: entry.data.summary ?? "",
            tags: entry.data.tags ?? [],
            title: entry.data.title ?? entry.data.name ?? slug,
            url: getLocalizedPath(entry.data.language, `${section}/${slug}`),
          };
        }),
    )
    .toSorted((a, b) => {
      const dateOrder = b.date.localeCompare(a.date);

      if (dateOrder !== 0) {
        return dateOrder;
      }

      return a.url.localeCompare(b.url);
    });
}
