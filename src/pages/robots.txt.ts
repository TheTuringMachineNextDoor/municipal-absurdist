// /robots.txt: a note to search engines' crawlers saying what they may
// read (everything but the styleguide and the admin panel) and where
// the sitemap is.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /styleguide', 'Disallow: /keystatic', '', `Sitemap: ${new URL('/sitemap.xml', site).href}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
