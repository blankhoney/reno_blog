import { getCollection } from "astro:content";

import { buildContentIndex } from "../lib/content-index";
import { getAllLibraryItems } from "../lib/library";

export async function GET() {
  const [writing, notes, projects] = await Promise.all([
    getCollection("writing"),
    getCollection("notes"),
    getCollection("projects"),
  ]);
  const library = getAllLibraryItems().map((item) => ({
    body: item.summary,
    data: {
      date: new Date(item.date),
      language: item.language,
      status: item.status,
      summary: item.summary,
      tags: item.tags,
      title: item.title,
      translationKey: item.key,
    },
  }));

  return new Response(
    JSON.stringify(
      {
        version: 1,
        items: buildContentIndex([
          { section: "writing", entries: writing },
          { section: "notes", entries: notes },
          { section: "projects", entries: projects },
          { section: "library", entries: library },
        ]),
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
