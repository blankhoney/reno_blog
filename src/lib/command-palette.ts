import type { ContentIndexItem } from "./content-index";
import { CONTACT_EMAIL, GITHUB_URL, getActionCards } from "./dashboard";
import { getNavigation, type Language } from "./i18n";

export type CommandPaletteAction = "copy" | "external" | "navigate";

export type CommandPaletteItem = {
  action: CommandPaletteAction;
  description: string;
  href?: string;
  id: string;
  keywords: string[];
  label: string;
  value?: string;
};

const copy = {
  zh: {
    aiAsk: "AI Ask 入口",
    aiAskBody: "查看静态索引覆盖范围，不调用 AI provider。",
    contentBody: "来自静态内容索引。",
    github: "打开 GitHub",
    home: "首页",
    homeBody: "返回个人 Dashboard。",
    now: "Now",
    nowBody: "当前重点和推进状态。",
  },
  en: {
    aiAsk: "AI Ask entry",
    aiAskBody: "Preview static index coverage without calling an AI provider.",
    contentBody: "From the static content index.",
    github: "Open GitHub",
    home: "Home",
    homeBody: "Return to the personal dashboard.",
    now: "Now",
    nowBody: "Current focus and active work.",
  },
};

export function buildCommandPaletteItems(
  language: Language,
  items: ContentIndexItem[],
): CommandPaletteItem[] {
  const labels = copy[language];
  const actionCards = getActionCards(language);
  const emailCard = actionCards.find((card) => card.kind === "email");
  const commands: CommandPaletteItem[] = [
    {
      action: "navigate",
      description: labels.homeBody,
      href: `/${language}/`,
      id: "nav:home",
      keywords: ["home", "dashboard", "index", language],
      label: labels.home,
    },
    ...getNavigation(language).map((item) => ({
      action: "navigate" as const,
      description: item.href,
      href: item.href,
      id: `nav:${item.href.replace(/^\/[a-z]{2}\//, "").replace(/\/$/, "") || "home"}`,
      keywords: [item.label, item.href],
      label: item.label,
    })),
    {
      action: "navigate",
      description: labels.nowBody,
      href: `/${language}/now/`,
      id: "nav:now",
      keywords: ["now", "current", "focus", "status"],
      label: labels.now,
    },
    {
      action: "copy",
      description: emailCard?.body ?? CONTACT_EMAIL,
      id: "action:copy-email",
      keywords: ["email", "contact", CONTACT_EMAIL],
      label: emailCard?.title ?? "Copy email",
      value: CONTACT_EMAIL,
    },
    {
      action: "external",
      description: actionCards.find((card) => card.kind === "github")?.body ?? GITHUB_URL,
      href: GITHUB_URL,
      id: "action:github",
      keywords: ["github", "repo", "source"],
      label: labels.github,
    },
    {
      action: "navigate",
      description: labels.aiAskBody,
      href: `/${language}/search/#ask`,
      id: "ai:ask-entry",
      keywords: ["ai", "ask", "index", "search"],
      label: labels.aiAsk,
    },
  ];

  const contentCommands = items
    .filter((item) => item.language === language)
    .map((item) => ({
      action: "navigate" as const,
      description: item.summary || labels.contentBody,
      href: item.url,
      id: `content:${item.key}`,
      keywords: [
        item.title,
        item.summary,
        item.section,
        item.slug,
        ...item.tags,
        ...item.techStack,
      ].filter(Boolean),
      label: item.title,
    }));

  return [...commands, ...contentCommands];
}
