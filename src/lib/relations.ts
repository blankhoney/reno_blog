import type { Language } from "./i18n";

export type RelatableContent = {
  key: string;
  language: Language;
  related?: string[];
  section: string;
  series?: string;
  slug: string;
  tags?: string[];
  techStack?: string[];
  title: string;
};

function sharedCount(left: string[] = [], right: string[] = []): number {
  const rightSet = new Set(right.map((value) => value.toLowerCase()));
  return left.filter((value) => rightSet.has(value.toLowerCase())).length;
}

function relationScore(current: RelatableContent, candidate: RelatableContent): number {
  const explicitRelated = current.related?.includes(candidate.key) ? 1000 : 0;
  const sharedTags = sharedCount(current.tags, candidate.tags) * 10;
  const sharedTech = sharedCount(current.techStack, candidate.techStack) * 8;
  const sharedSeries = current.series && current.series === candidate.series ? 40 : 0;
  const sameSection = current.section === candidate.section ? 1 : 0;

  return explicitRelated + sharedSeries + sharedTags + sharedTech + sameSection;
}

export function getRelatedContent<TContent extends RelatableContent>(
  items: TContent[],
  currentKey: string,
  limit = 4,
): TContent[] {
  const current = items.find((item) => item.key === currentKey);
  if (!current) {
    return [];
  }

  return items
    .filter((item) => item.key !== current.key)
    .filter((item) => item.language === current.language)
    .map((item) => ({ item, score: relationScore(current, item) }))
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.item.title.localeCompare(b.item.title);
    })
    .slice(0, limit)
    .map(({ item }) => item);
}

