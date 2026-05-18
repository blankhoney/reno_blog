import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPublishedEntriesForLanguage } from "../../lib/content";
import { SUPPORTED_LANGUAGES, type Language } from "../../lib/i18n";
import { site as siteConfig } from "../../config/site";

export function getStaticPaths() {
  return SUPPORTED_LANGUAGES.map((language) => ({ params: { lang: language } }));
}

export async function GET(context: { params: { lang: Language }; site: URL }) {
  const language = context.params.lang;
  const writing = getPublishedEntriesForLanguage(
    (await getCollection("writing")).map((entry) => ({
      ...entry,
      slug: entry.data.translationKey,
    })),
    language,
  );
  const notes = getPublishedEntriesForLanguage(
    (await getCollection("notes")).map((entry) => ({
      ...entry,
      slug: entry.data.translationKey,
    })),
    language,
  );

  return rss({
    title: `${siteConfig.name} ${language === "zh" ? "订阅" : "Feed"}`,
    description: siteConfig.description[language],
    site: context.site,
    items: [...writing, ...notes].map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/${language}/${entry.collection}/${entry.slug}/`,
    })),
    customData: `<language>${language}</language>`,
  });
}
