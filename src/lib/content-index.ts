import type { Language } from "./i18n";
import { getLocalizedPath } from "./i18n";

type PublishStatus = "draft" | "published";

export type ContentIndexSection = "writing" | "notes" | "projects" | "library";

export type ContentIndexEntry = {
  body?: string;
  data: {
    date: Date;
    language: Language;
    name?: string;
    related?: string[];
    series?: string;
    status: PublishStatus;
    summary?: string;
    tags?: string[];
    techStack?: string[];
    title?: string;
    translationKey: string;
    updated?: Date;
  };
};

export type ContentIndexSource = {
  section: ContentIndexSection;
  entries: ContentIndexEntry[];
};

export type ContentIndexItem = {
  date: string;
  excerpt: string;
  key: string;
  language: Language;
  relationKeys: string[];
  section: ContentIndexSection;
  slug: string;
  summary: string;
  tags: string[];
  techStack: string[];
  title: string;
  updated?: string;
  url: string;
};

function buildExcerpt(entry: ContentIndexEntry): string {
  const source = entry.body ?? entry.data.summary ?? "";

  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
}

export function buildContentIndex(sources: ContentIndexSource[]): ContentIndexItem[] {
  return sources
    .flatMap(({ section, entries }) =>
      entries
        .filter((entry) => entry.data.status === "published")
        .map((entry) => {
          const slug = entry.data.translationKey;
          const key = `${section}:${slug}`;

          return {
            date: entry.data.date.toISOString().slice(0, 10),
            excerpt: buildExcerpt(entry),
            key,
            language: entry.data.language,
            relationKeys: entry.data.related ?? [],
            section,
            slug,
            summary: entry.data.summary ?? "",
            tags: entry.data.tags ?? [],
            techStack: entry.data.techStack ?? [],
            title: entry.data.title ?? entry.data.name ?? slug,
            updated: entry.data.updated?.toISOString().slice(0, 10),
            url:
              section === "library"
                ? `${getLocalizedPath(entry.data.language, "library")}#${slug}`
                : getLocalizedPath(entry.data.language, `${section}/${slug}`),
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
