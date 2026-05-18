import { getCollection } from "astro:content";

import { buildContentIndex } from "../lib/content-index";

export async function GET() {
  const [writing, notes, projects] = await Promise.all([
    getCollection("writing"),
    getCollection("notes"),
    getCollection("projects"),
  ]);

  return new Response(
    JSON.stringify(
      {
        version: 1,
        items: buildContentIndex([
          { section: "writing", entries: writing },
          { section: "notes", entries: notes },
          { section: "projects", entries: projects },
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
