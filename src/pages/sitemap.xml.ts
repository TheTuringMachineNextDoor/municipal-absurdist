// /sitemap.xml: a list of every page, which search engines read to find
// them all. A file ending .ts in src/pages is an "endpoint": instead of
// a web page it returns whatever the GET function gives back.
import type { APIRoute } from 'astro';
import { allPagePaths } from '../lib/site-pages';

export const GET: APIRoute = async ({ site }) => {
  const pages = await allPagePaths();
  const entries = pages
    .map(({ path, lastModified }) => {
      const loc = new URL(path, site).href;
      const lastmod = lastModified ? `<lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${lastmod}</url>`;
    })
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
