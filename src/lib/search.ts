import type { Language } from "./i18n";
import type { ContentIndexItem } from "./content-index";

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function filterSearchItems(
  items: ContentIndexItem[],
  language: Language,
  query: string,
): ContentIndexItem[] {
  const localizedItems = items.filter((item) => item.language === language);
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return localizedItems;
  }

  return localizedItems.filter((item) =>
    [
      item.title,
      item.summary,
      item.excerpt,
      item.section,
      item.slug,
      item.key,
      ...item.tags,
      ...item.techStack,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
