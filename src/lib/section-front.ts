// Works out what goes on each page of a section front, so that the
// first page (/politics) and the later ones (/politics/page/2) agree.
import type { sections } from '../data/sections';
import { getPublishedArticles, type Article } from './articles';

export type Section = (typeof sections)[number];

/** Cards on each page of a news section, beneath the lead on page one. */
export const CARDS_PER_PAGE = 12;
/** Strips on each page of the Comic section. They are shown large. */
export const COMICS_PER_PAGE = 6;

export const perPage = (section: Section) => (section.slug === 'comic' ? COMICS_PER_PAGE : CARDS_PER_PAGE);

/** A section's lead and the rest of its articles, newest first.
    The lead is the newest article marked "featured" in the section, or
    failing that the newest. The Comic section has no lead: every strip
    is shown the same size. */
export async function sectionContents(section: Section) {
  const all = await getPublishedArticles();
  const filed = all.filter((a) => a.data.section === section.slug);
  const lead: Article | undefined =
    section.slug === 'comic' ? undefined : (filed.find((a) => a.data.featured) ?? filed[0]);
  const rest = filed.filter((a) => a !== lead);
  // Newest from the other news sections, for the "Also in the Paper" column.
  const elsewhere = all.filter((a) => a.data.section !== section.slug && a.data.section !== 'comic').slice(0, 4);
  return { lead, rest, elsewhere, pages: Math.max(1, Math.ceil(rest.length / perPage(section))) };
}

/** The address of a page of a section front. Page one is the plain
    section address. */
export const sectionPageHref = (section: Section, page: number) =>
  page <= 1 ? `/${section.slug}` : `/${section.slug}/page/${page}`;

