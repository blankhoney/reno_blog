import type { Language } from "./i18n";

type PublishStatus = "draft" | "published";

export type TranslationPairEntry = {
  id: string;
  data: {
    language: Language;
    status: PublishStatus;
    translationKey: string;
  };
};

export type MissingTranslationPair = {
  existingLanguage: Language;
  missingLanguage: Language;
  translationKey: string;
};

export function findMissingPublishedTranslationPairs(
  entries: TranslationPairEntry[],
): MissingTranslationPair[] {
  const publishedLanguagesByKey = new Map<string, Set<Language>>();

  for (const entry of entries) {
    if (entry.data.status !== "published") {
      continue;
    }

    const languages =
      publishedLanguagesByKey.get(entry.data.translationKey) ?? new Set<Language>();
    languages.add(entry.data.language);
    publishedLanguagesByKey.set(entry.data.translationKey, languages);
  }

  const missingPairs: MissingTranslationPair[] = [];

  for (const [translationKey, languages] of publishedLanguagesByKey) {
    if (languages.has("zh") && !languages.has("en")) {
      missingPairs.push({
        existingLanguage: "zh",
        missingLanguage: "en",
        translationKey,
      });
    }

    if (languages.has("en") && !languages.has("zh")) {
      missingPairs.push({
        existingLanguage: "en",
        missingLanguage: "zh",
        translationKey,
      });
    }
  }

  return missingPairs;
}
