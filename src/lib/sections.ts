import { getLocalizedPath, type Language } from "./i18n";

export type ContentSection = "writing" | "notes" | "projects";

export type SectionNavigation = {
  href: string;
  label: string;
  returnLabel: string;
};

const sectionLabels: Record<
  Language,
  Record<ContentSection, { label: string; returnLabel: string }>
> = {
  zh: {
    writing: { label: "写作", returnLabel: "返回写作" },
    notes: { label: "笔记", returnLabel: "返回笔记" },
    projects: { label: "项目", returnLabel: "返回项目" },
  },
  en: {
    writing: { label: "Writing", returnLabel: "Back to Writing" },
    notes: { label: "Notes", returnLabel: "Back to Notes" },
    projects: { label: "Projects", returnLabel: "Back to Projects" },
  },
};

export function getSectionNavigation(
  language: Language,
  section: ContentSection,
): SectionNavigation {
  return {
    href: getLocalizedPath(language, section),
    ...sectionLabels[language][section],
  };
}
