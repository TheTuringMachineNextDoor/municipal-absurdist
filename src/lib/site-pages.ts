// Every public page of the site, for the sitemap. Pages made from
// content (articles, products, people) are looked up; the fixed pages
// are listed by hand, so add a new fixed page here when you make one.
import { getCollection } from 'astro:content';
import { games } from '../data/games';
import { sections } from '../data/sections';
import { articlePath, getPublishedArticles } from './articles';
import { contributorPath } from './contributors';
import { sectionContents, sectionPageHref } from './section-front';
import { productPath } from './store';

const FIXED = ['/', '/about', '/archive', '/contact', '/games', '/newsletter', '/store', '/submit', '/support', '/games/crossword/submit'];

export async function allPagePaths(): Promise<{ path: string; lastModified?: Date }[]> {
  const articles = await getPublishedArticles();
  const sectionPages = [];
  for (const section of sections) {
    if (section.slug === 'games') continue;
    const { pages } = await sectionContents(section);
    for (let page = 1; page <= pages; page++) sectionPages.push({ path: sectionPageHref(section, page) });
  }
  return [
    ...FIXED.map((path) => ({ path })),
    ...sectionPages,
    ...articles.map((article) => ({ path: articlePath(article), lastModified: article.data.date })),
    ...games.filter((game) => game.live).map((game) => ({ path: `/games/${game.slug}` })),
    ...(await getCollection('contributors')).map((person) => ({ path: contributorPath(person) })),
    ...(await getCollection('products')).map((product) => ({ path: productPath(product) })),
  ];
}
