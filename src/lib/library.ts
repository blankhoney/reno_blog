import type { Language } from "./i18n";

export const LIBRARY_SURFACES = ["uses", "reading", "now", "patterns", "bookmarks"] as const;

export type LibrarySurfaceId = (typeof LIBRARY_SURFACES)[number];

export type LibraryItem = {
  date: string;
  demo: true;
  key: string;
  language: Language;
  status: "published";
  summary: string;
  surface: LibrarySurfaceId;
  tags: string[];
  title: string;
  url?: string;
};

export type LibrarySurfaceGroup = {
  body: string;
  id: LibrarySurfaceId;
  items: LibraryItem[];
  title: string;
};

const surfaceCopy: Record<
  Language,
  Record<LibrarySurfaceId, { body: string; title: string }>
> = {
  zh: {
    uses: {
      title: "工具栈",
      body: "长期使用或正在评估的工具、设备和服务。",
    },
    reading: {
      title: "阅读",
      body: "书籍、文章、研究材料和阅读状态。",
    },
    now: {
      title: "现在",
      body: "当前关注、正在推进和暂时搁置的方向。",
    },
    patterns: {
      title: "模式",
      body: "可复用的产品、界面和工程观察。",
    },
    bookmarks: {
      title: "书签",
      body: "值得反复返回的外部资源。",
    },
  },
  en: {
    uses: {
      title: "Uses",
      body: "Tools, gear, services, and workflows that are in use or under review.",
    },
    reading: {
      title: "Reading",
      body: "Books, articles, research references, and reading states.",
    },
    now: {
      title: "Now",
      body: "Current focus areas, active work, and parked threads.",
    },
    patterns: {
      title: "Patterns",
      body: "Reusable product, interface, and engineering observations.",
    },
    bookmarks: {
      title: "Bookmarks",
      body: "External references worth revisiting.",
    },
  },
};

const libraryItems: LibraryItem[] = [
  {
    date: "2026-05-19",
    demo: true,
    key: "astro-static-stack",
    language: "zh",
    status: "published",
    summary: "示例种子：Astro、MDX、TypeScript 和 Docker 组成当前静态站点基线。",
    surface: "uses",
    tags: ["astro", "static-site"],
    title: "Astro 静态站点栈",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "editor-agent-loop",
    language: "zh",
    status: "published",
    summary: "示例种子：用测试、浏览器检查和小提交组织 agent 迭代。",
    surface: "uses",
    tags: ["workflow", "agent"],
    title: "编辑器与 Agent 循环",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "deployment-baseline",
    language: "zh",
    status: "published",
    summary: "示例种子：GitHub Actions、GHCR 和自托管服务器构成部署路径。",
    surface: "uses",
    tags: ["cicd", "docker"],
    title: "部署基线",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "personal-site-research",
    language: "zh",
    status: "published",
    summary: "示例种子：围绕个人站点、长期界面和内容发现的研究材料。",
    surface: "reading",
    tags: ["research", "personal-site"],
    title: "个人站点研究材料",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "reader-experience",
    language: "zh",
    status: "published",
    summary: "示例种子：长文阅读体验、目录、代码块和内容导航的参考。",
    surface: "reading",
    tags: ["reader-shell", "writing"],
    title: "阅读体验参考",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "experience-islands",
    language: "zh",
    status: "published",
    summary: "示例种子：Astro islands、React 交互和受控 3D 可视化资料。",
    surface: "reading",
    tags: ["islands", "3d"],
    title: "体验岛资料",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "site-foundation",
    language: "zh",
    status: "published",
    summary: "示例种子：当前重点是打磨静态双语站点的阅读和发现能力。",
    surface: "now",
    tags: ["focus", "site"],
    title: "站点基础",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "qa-prep",
    language: "zh",
    status: "published",
    summary: "示例种子：为未来 AI 问答准备静态索引和内容关系。",
    surface: "now",
    tags: ["ai-ready", "index"],
    title: "问答准备",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "visual-lab",
    language: "zh",
    status: "published",
    summary: "示例种子：把 3D 和可视化限制在可替换的 experience island。",
    surface: "now",
    tags: ["playground", "project-orbit"],
    title: "视觉实验",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "static-first",
    language: "zh",
    status: "published",
    summary: "示例种子：先用静态 HTML 承载重要内容，再增加局部交互。",
    surface: "patterns",
    tags: ["architecture", "static"],
    title: "静态优先",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "bilingual-pairs",
    language: "zh",
    status: "published",
    summary: "示例种子：内容以 zh/en 成对维护，避免运行时翻译。",
    surface: "patterns",
    tags: ["i18n", "content"],
    title: "双语内容对",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "bounded-islands",
    language: "zh",
    status: "published",
    summary: "示例种子：交互只在明确负责的局部岛中出现。",
    surface: "patterns",
    tags: ["islands", "frontend"],
    title: "受控交互岛",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "astro-docs",
    language: "zh",
    status: "published",
    summary: "示例种子：Astro 官方文档是框架行为的优先参考。",
    surface: "bookmarks",
    tags: ["astro", "docs"],
    title: "Astro 文档",
    url: "https://docs.astro.build/",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "playwright-docs",
    language: "zh",
    status: "published",
    summary: "示例种子：Playwright 文档用于浏览器烟测和截图验证。",
    surface: "bookmarks",
    tags: ["playwright", "testing"],
    title: "Playwright 文档",
    url: "https://playwright.dev/",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "axe-docs",
    language: "zh",
    status: "published",
    summary: "示例种子：axe-core 用于自动化可访问性检查。",
    surface: "bookmarks",
    tags: ["a11y", "testing"],
    title: "axe-core 文档",
    url: "https://github.com/dequelabs/axe-core",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "astro-static-stack",
    language: "en",
    status: "published",
    summary: "Demo seed: Astro, MDX, TypeScript, and Docker form the current static-site baseline.",
    surface: "uses",
    tags: ["astro", "static-site"],
    title: "Astro static site stack",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "editor-agent-loop",
    language: "en",
    status: "published",
    summary: "Demo seed: tests, browser checks, and small commits shape agent iteration.",
    surface: "uses",
    tags: ["workflow", "agent"],
    title: "Editor and agent loop",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "deployment-baseline",
    language: "en",
    status: "published",
    summary: "Demo seed: GitHub Actions, GHCR, and a self-hosted server define deployment.",
    surface: "uses",
    tags: ["cicd", "docker"],
    title: "Deployment baseline",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "personal-site-research",
    language: "en",
    status: "published",
    summary: "Demo seed: research around personal sites, long-lived interfaces, and discovery.",
    surface: "reading",
    tags: ["research", "personal-site"],
    title: "Personal site research",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "reader-experience",
    language: "en",
    status: "published",
    summary: "Demo seed: references for long-form reading, TOC, code blocks, and navigation.",
    surface: "reading",
    tags: ["reader-shell", "writing"],
    title: "Reader experience references",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "experience-islands",
    language: "en",
    status: "published",
    summary: "Demo seed: Astro islands, React interactions, and bounded 3D visualization.",
    surface: "reading",
    tags: ["islands", "3d"],
    title: "Experience island references",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "site-foundation",
    language: "en",
    status: "published",
    summary: "Demo seed: current focus is improving reading and discovery for the bilingual static site.",
    surface: "now",
    tags: ["focus", "site"],
    title: "Site foundation",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "qa-prep",
    language: "en",
    status: "published",
    summary: "Demo seed: prepare static indexes and content relations for future AI Q&A.",
    surface: "now",
    tags: ["ai-ready", "index"],
    title: "Q&A preparation",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "visual-lab",
    language: "en",
    status: "published",
    summary: "Demo seed: keep 3D and visualization inside replaceable experience islands.",
    surface: "now",
    tags: ["playground", "project-orbit"],
    title: "Visual lab",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "static-first",
    language: "en",
    status: "published",
    summary: "Demo seed: important content ships as static HTML before local interaction is added.",
    surface: "patterns",
    tags: ["architecture", "static"],
    title: "Static first",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "bilingual-pairs",
    language: "en",
    status: "published",
    summary: "Demo seed: content is maintained as zh/en pairs instead of runtime translation.",
    surface: "patterns",
    tags: ["i18n", "content"],
    title: "Bilingual pairs",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "bounded-islands",
    language: "en",
    status: "published",
    summary: "Demo seed: interaction appears only in local islands with clear page jobs.",
    surface: "patterns",
    tags: ["islands", "frontend"],
    title: "Bounded islands",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "astro-docs",
    language: "en",
    status: "published",
    summary: "Demo seed: Astro docs are the first reference for framework behavior.",
    surface: "bookmarks",
    tags: ["astro", "docs"],
    title: "Astro docs",
    url: "https://docs.astro.build/",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "playwright-docs",
    language: "en",
    status: "published",
    summary: "Demo seed: Playwright docs guide browser smoke and screenshot verification.",
    surface: "bookmarks",
    tags: ["playwright", "testing"],
    title: "Playwright docs",
    url: "https://playwright.dev/",
  },
  {
    date: "2026-05-19",
    demo: true,
    key: "axe-docs",
    language: "en",
    status: "published",
    summary: "Demo seed: axe-core powers automated accessibility checks.",
    surface: "bookmarks",
    tags: ["a11y", "testing"],
    title: "axe-core docs",
    url: "https://github.com/dequelabs/axe-core",
  },
];

export function getLibraryItems(language: Language): LibraryItem[] {
  return libraryItems.filter((item) => item.language === language && item.status === "published");
}

export function getAllLibraryItems(): LibraryItem[] {
  return libraryItems.filter((item) => item.status === "published");
}

export function getLibraryItemsForSurface(
  language: Language,
  surface: LibrarySurfaceId,
): LibraryItem[] {
  return getLibraryItems(language).filter((item) => item.surface === surface);
}

export function getLibrarySurfaceGroups(language: Language): LibrarySurfaceGroup[] {
  const items = getLibraryItems(language);

  return LIBRARY_SURFACES.map((surface) => ({
    id: surface,
    ...surfaceCopy[language][surface],
    items: items.filter((item) => item.surface === surface),
  }));
}
