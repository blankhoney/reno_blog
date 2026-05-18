import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const supportedCollections = new Set(["writing", "notes", "projects", "library"]);
const languages = ["zh", "en"];

function quoteYaml(value) {
  return JSON.stringify(value);
}

function formatFrontmatter(frontmatter) {
  return Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((item) => `  - ${quoteYaml(item)}`).join("\n")}`;
      }

      if (typeof value === "boolean") {
        return `${key}: ${value ? "true" : "false"}`;
      }

      return `${key}: ${quoteYaml(value)}`;
    })
    .join("\n");
}

export function buildDraftPair(input) {
  const collection = input.collection;
  if (!supportedCollections.has(collection)) {
    throw new Error(`Unsupported collection: ${collection}`);
  }

  const slug = input.slug?.trim();
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must use kebab-case lowercase words.");
  }

  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const tags = input.tags ?? [];

  return languages.map((language) => {
    const title = input.title?.[language] ?? `${slug} ${language}`;
    const summary = input.summary?.[language] ?? "";
    const frontmatter = {
      title,
      summary,
      date,
      language,
      translationKey: slug,
      tags,
      status: "draft",
      featured: false,
    };

    const body =
      language === "zh"
        ? "Seed draft. 这是由本地脚本生成的草稿，请在发布前替换为真实内容。"
        : "Seed draft. This local script generated the draft; replace it with real content before publishing.";

    return {
      body,
      frontmatter,
      path: `src/content/${collection}/${slug}.${language}.mdx`,
      source: `---\n${formatFrontmatter(frontmatter)}\n---\n\n${body}\n`,
    };
  });
}

export function writeDraftPair(input) {
  const drafts = buildDraftPair(input);

  for (const draft of drafts) {
    if (existsSync(draft.path)) {
      throw new Error(`Refusing to overwrite existing file: ${draft.path}`);
    }

    mkdirSync(dirname(draft.path), { recursive: true });
    writeFileSync(draft.path, draft.source, "utf8");
  }

  return drafts;
}

function readCliArgs(argv) {
  const args = new Map();

  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error("Usage: node scripts/content-drafts.mjs --collection notes --slug example --zh-title 标题 --en-title Title");
    }
    args.set(key.slice(2), value);
  }

  const tags = args.get("tags")?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];

  return {
    collection: args.get("collection") ?? "notes",
    date: args.get("date"),
    slug: args.get("slug"),
    summary: {
      zh: args.get("zh-summary") ?? "",
      en: args.get("en-summary") ?? "",
    },
    tags,
    title: {
      zh: args.get("zh-title"),
      en: args.get("en-title"),
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const drafts = writeDraftPair(readCliArgs(process.argv.slice(2)));
  for (const draft of drafts) {
    console.log(`created ${draft.path}`);
  }
}

