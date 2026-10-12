// The six sections of the paper, in masthead order. The nav reads from
// this list now; the article content collection will reuse the slugs in
// Phase 2, so a section is only ever named in one place.

export const sections = [
  { slug: 'politics', name: 'Politics' },
  { slug: 'culture', name: 'Culture' },
  { slug: 'education', name: 'Education' },
  { slug: 'money', name: 'Money' },
  { slug: 'comic', name: 'Comic' },
  { slug: 'games', name: 'Games' },
] as const;

export type SectionSlug = (typeof sections)[number]['slug'];
