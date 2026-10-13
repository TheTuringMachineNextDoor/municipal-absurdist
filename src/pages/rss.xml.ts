// /rss.xml: the feed. Feed readers check this address and show new
// articles as they are published. Each item has the headline, the dek,
// the author and a link; the full text stays on the site.
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { sections } from '../data/sections';
import { articlePath, getPublishedArticles } from '../lib/articles';

/** Make text safe to put inside XML. */
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const articles = (await getPublishedArticles()).slice(0, 30);
  const items = await Promise.all(
    articles.map(async (article) => {
      const link = new URL(articlePath(article), site).href;
      const author = (await getEntry(article.data.author)).data.name;
      const section = sections.find((s) => s.slug === article.data.section)!.name;
      return [
        '    <item>',
        `      <title>${escape(article.data.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escape(article.data.dek)}</description>`,
        `      <dc:creator>${escape(author)}</dc:creator>`,
        `      <category>${escape(section)}</category>`,
        `      <pubDate>${article.data.date.toUTCString()}</pubDate>`,
        '    </item>',
      ].join('\n');
    }),
  );
  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>The Municipal Absurdist</title>',
    `    <link>${new URL('/', site).href}</link>`,
    `    <atom:link href="${new URL('/rss.xml', site).href}" rel="self" type="application/rss+xml" />`,
    '    <description>An independent newspaper of satire. The public is advised to remain calm.</description>',
    '    <language>en</language>',
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
