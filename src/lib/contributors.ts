// Helpers shared by the pages about contributors.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getPublishedArticles, type Article } from './articles';

export type Contributor = CollectionEntry<'contributors'>;

/** The address of a contributor's page. The last part is their file name. */
export const contributorPath = (contributor: { id: string }) => `/contributors/${contributor.id}`;

/** "Writer", "Illustrator", or both, for printing under a name. */
export const roleLabel = (role: Contributor['data']['role']) =>
  ({ writer: 'Writer', illustrator: 'Illustrator', both: 'Writer and Illustrator' })[role];

/** The letter shown in place of a portrait: the first letter of the
    name, skipping a leading "The" ("The Comics Desk" gives C). */
export const initialOf = (name: string) => name.replace(/^The\s+/i, '').charAt(0).toUpperCase();

/** The opening sentence of a bio, for the staff list. A full stop after
    a title ("Mr. Wetherby") does not end the sentence. */
export const firstSentence = (text: string) =>
  text.trim().split(/(?<!\b(?:Mr|Mrs|Ms|Dr|St|Prof)\.)(?<=[.!?])\s+/)[0];

/** Every contributor, in alphabetical order of name (again ignoring a
    leading "The"), each with the published articles they wrote and the
    ones they illustrated, newest first. */
export async function getContributors() {
  const [people, articles] = await Promise.all([getCollection('contributors'), getPublishedArticles()]);
  const sortName = (c: Contributor) => c.data.name.replace(/^The\s+/i, '');
  return people
    .sort((a, b) => sortName(a).localeCompare(sortName(b)))
    .map((person) => ({
      person,
      written: articles.filter((a: Article) => a.data.author.id === person.id),
      illustrated: articles.filter((a: Article) => a.data.illustrator?.id === person.id),
    }));
}
