import { getRobotsTxt } from "../lib/seo";

export function GET({ site }: { site: URL }) {
  return new Response(getRobotsTxt(site.toString()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
