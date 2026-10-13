// Helpers shared by every page that lists or links to articles.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { sections } from '../data/sections';

export type Article = CollectionEntry<'articles'>;

/** Every article fit to print, newest first. Drafts are visible while
    developing (`npm run dev`) and left out of the built site. */
export async function getPublishedArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** The few facts a card or lead story needs, with the author's name
    looked up from the contributors collection. */
export async function summarize(article: Article) {
  const author = await getEntry(article.data.author);
  const section = sections.find((s) => s.slug === article.data.section)!;
  return {
    href: articlePath(article),
    title: article.data.title,
    dek: article.data.dek,
    author: author.data.name,
    date: article.data.date,
    image: article.data.image,
    imageAlt: article.data.imageAlt,
    imageCredit: article.data.imageCredit,
    sectionName: section.name,
    sectionHref: `/${section.slug}`,
  };
}

/** The address of an article: /section/slug. The slug is the file name. */
export const articlePath = (article: Article) => `/${article.data.section}/${article.id}`;

/** "Monday, October 12, 2026", plus the machine-readable form for <time>.
    Dates in front matter have no time of day, so they are read as UTC;
    formatting in UTC as well stops them slipping back a day. */
export function formatDate(date: Date) {
  return {
    label: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    iso: date.toISOString().slice(0, 10),
    // "Oct 12, 2026", for places with little room (the cards).
    short: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }),
  };
}
