export const SUPPORTED_LANGUAGES = ["zh", "en"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "zh";

export type NavigationItem = {
  href: string;
  label: string;
};

const navigationLabels: Record<Language, Array<{ slug: string; label: string }>> = {
  zh: [
    { slug: "writing", label: "写作" },
    { slug: "notes", label: "笔记" },
    { slug: "projects", label: "项目" },
    { slug: "about", label: "关于" },
    { slug: "playground", label: "实验室" },
  ],
  en: [
    { slug: "writing", label: "Writing" },
    { slug: "notes", label: "Notes" },
    { slug: "projects", label: "Projects" },
    { slug: "about", label: "About" },
    { slug: "playground", label: "Playground" },
  ],
};

export function isSupportedLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export function getLocalizedPath(language: Language, path: string): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");
  const suffix = normalizedPath.length > 0 ? `${normalizedPath}/` : "";

  return `/${language}/${suffix}`;
}

export function getNavigation(language: Language): NavigationItem[] {
  return navigationLabels[language].map((item) => ({
    href: getLocalizedPath(language, item.slug),
    label: item.label,
  }));
}
