import type { ContentIndexItem, ContentIndexSection } from "./content-index";
import type { Language } from "./i18n";

export const CONTACT_EMAIL = "hello@blankhoney.xyz";
export const GITHUB_URL = "https://github.com/blankhoney/reno_blog";

export type EvidenceLink = {
  section: ContentIndexSection;
  title: string;
  url: string;
};

export type VerificationItem = {
  label: string;
  value: string;
};

export type ProjectEvidenceCard = {
  evidenceLinks: EvidenceLink[];
  outcome: string;
  summary: string;
  tags: string[];
  techStack: string[];
  title: string;
  url: string;
  verification: VerificationItem[];
};

export type SkillEvidence = {
  evidence: EvidenceLink[];
  evidenceCount: number;
  name: string;
};

export type ActionCardKind = "email" | "github" | "now" | "resume";

export type ActionCard = {
  body: string;
  href?: string;
  kind: ActionCardKind;
  title: string;
  value?: string;
};

export type AiAskPreview = {
  body: string;
  providerBoundary: string;
  sections: Array<{
    count: number;
    label: string;
    section: ContentIndexSection;
  }>;
  suggestions: string[];
  title: string;
};

const sectionLabels: Record<Language, Record<ContentIndexSection, string>> = {
  zh: {
    library: "资料库",
    notes: "笔记",
    projects: "项目",
    writing: "写作",
  },
  en: {
    library: "Library",
    notes: "Notes",
    projects: "Projects",
    writing: "Writing",
  },
};

const skillLabelOverrides: Record<string, string> = {
  "3d": "3D",
  "ai-ready": "AI Ready",
  astro: "Astro",
  cicd: "CI/CD",
  docker: "Docker",
  frontend: "Frontend",
  i18n: "I18N",
  islands: "Islands",
  "personal-site": "Personal Site",
  "project-orbit": "ProjectOrbit",
  "reader-shell": "Reader Shell",
  research: "Research",
  "static-site": "Static Site",
  typescript: "TypeScript",
  workflow: "Workflow",
};

function toEvidenceLink(item: ContentIndexItem): EvidenceLink {
  return {
    section: item.section,
    title: item.title,
    url: item.url,
  };
}

function normalizeSkillName(value: string): string {
  const key = value.trim().toLowerCase();

  return (
    skillLabelOverrides[key] ??
    key
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(" ")
  );
}

function getItemsForLanguage(items: ContentIndexItem[], language: Language): ContentIndexItem[] {
  return items.filter((item) => item.language === language);
}

function buildVerification(
  project: ContentIndexItem,
  relatedItems: ContentIndexItem[],
  language: Language,
): VerificationItem[] {
  const labels = {
    zh: {
      astro: "静态 Astro 构建",
      cicd: "CI/CD 基线",
      docker: "Docker 打包",
      relations: "内容关系",
    },
    en: {
      astro: "Static Astro build",
      cicd: "CI/CD baseline",
      docker: "Docker packaging",
      relations: "Content relations",
    },
  }[language];
  const text = [...project.tags, ...project.techStack].join(" ").toLowerCase();
  const relatedText = relatedItems
    .flatMap((item) => [item.key, ...item.tags, ...item.techStack])
    .join(" ")
    .toLowerCase();
  const verification: VerificationItem[] = [];

  if (text.includes("astro")) {
    verification.push({ label: labels.astro, value: project.updated ?? project.date });
  }

  if (text.includes("docker")) {
    verification.push({ label: labels.docker, value: project.updated ?? project.date });
  }

  if (relatedText.includes("cicd")) {
    verification.push({ label: labels.cicd, value: relatedItems[0]?.date ?? project.date });
  }

  if (project.relationKeys.length > 0) {
    verification.push({ label: labels.relations, value: String(project.relationKeys.length) });
  }

  return verification;
}

export function buildProjectEvidenceCards(
  items: ContentIndexItem[],
  language: Language,
): ProjectEvidenceCard[] {
  const languageItems = getItemsForLanguage(items, language);
  const itemByKey = new Map(languageItems.map((item) => [item.key, item]));

  return languageItems
    .filter((item) => item.section === "projects")
    .map((project) => {
      const relatedItems = project.relationKeys
        .map((key) => itemByKey.get(key))
        .filter((item): item is ContentIndexItem => Boolean(item));

      return {
        evidenceLinks: relatedItems.map(toEvidenceLink),
        outcome: project.summary || project.excerpt,
        summary: project.summary,
        tags: project.tags,
        techStack: project.techStack,
        title: project.title,
        url: project.url,
        verification: buildVerification(project, relatedItems, language),
      };
    });
}

export function buildSkillEvidenceMap(
  items: ContentIndexItem[],
  language: Language,
  limit = 12,
): SkillEvidence[] {
  const skills = new Map<string, Map<string, EvidenceLink>>();

  for (const item of getItemsForLanguage(items, language)) {
    const names = new Set([...item.techStack, ...item.tags].map(normalizeSkillName));

    for (const name of names) {
      if (!skills.has(name)) {
        skills.set(name, new Map());
      }

      skills.get(name)?.set(item.key, toEvidenceLink(item));
    }
  }

  return Array.from(skills.entries())
    .map(([name, evidenceByKey]) => {
      const evidence = Array.from(evidenceByKey.values());

      return {
        evidence,
        evidenceCount: evidence.length,
        name,
      };
    })
    .filter((skill) => skill.evidenceCount > 0)
    .toSorted((a, b) => {
      if (b.evidenceCount !== a.evidenceCount) {
        return b.evidenceCount - a.evidenceCount;
      }

      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function getActionCards(language: Language): ActionCard[] {
  const copy = {
    zh: {
      emailBody: "复制联系邮箱，适合具体项目、合作或反馈。",
      emailTitle: "复制邮箱",
      githubBody: "查看公开代码、提交记录和部署基线。",
      githubTitle: "打开 GitHub",
      nowBody: "查看当前重点、正在推进和暂时搁置的方向。",
      nowTitle: "查看 Now",
    },
    en: {
      emailBody: "Copy the contact email for concrete projects, collaboration, or feedback.",
      emailTitle: "Copy email",
      githubBody: "Open public code, commits, and the delivery baseline.",
      githubTitle: "Open GitHub",
      nowBody: "See current focus areas, active work, and parked threads.",
      nowTitle: "Open Now",
    },
  }[language];

  return [
    {
      body: copy.emailBody,
      kind: "email",
      title: copy.emailTitle,
      value: CONTACT_EMAIL,
    },
    {
      body: copy.githubBody,
      href: GITHUB_URL,
      kind: "github",
      title: copy.githubTitle,
    },
    {
      body: copy.nowBody,
      href: `/${language}/now/`,
      kind: "now",
      title: copy.nowTitle,
    },
  ];
}

export function buildAiAskPreview(
  items: ContentIndexItem[],
  language: Language,
): AiAskPreview {
  const languageItems = getItemsForLanguage(items, language);
  const sections = (["writing", "notes", "projects", "library"] as const)
    .map((section) => ({
      count: languageItems.filter((item) => item.section === section).length,
      label: sectionLabels[language][section],
      section,
    }))
    .filter((section) => section.count > 0);
  const copy = {
    zh: {
      body: "先展示静态索引能覆盖的内容范围，未来再接入真正的问答运行时。",
      boundary: "未接入 AI provider、server API、向量数据库或账号系统。",
      suggestions: ["这个站点如何部署？", "哪些内容和 Astro 有关？", "项目证据在哪里？"],
      title: "询问静态索引",
    },
    en: {
      body: "Preview what the static index can cover before a real Q&A runtime exists.",
      boundary: "No AI provider, server API, vector database, or account system is connected.",
      suggestions: [
        "How is this site deployed?",
        "Which content mentions Astro?",
        "Where is the project evidence?",
      ],
      title: "Ask the static index",
    },
  }[language];

  return {
    body: copy.body,
    providerBoundary: copy.boundary,
    sections,
    suggestions: copy.suggestions,
    title: copy.title,
  };
}
