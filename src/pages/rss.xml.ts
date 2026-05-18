export function GET({ site }: { site: URL }) {
  return Response.redirect(new URL("/zh/rss.xml", site), 302);
}
