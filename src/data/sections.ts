// The six sections of the paper, in masthead order. The nav reads from
// this list now; the article content collection will reuse the slugs in
// Phase 2, so a section is only ever named in one place.

//
// `ink` is the colour of the stroke that glides across the section's
// name in the nav when the pointer is over it.

export const sections = [
  { slug: 'politics', name: 'Politics', ink: '#A8321F' },   // vermilion
  { slug: 'culture', name: 'Culture', ink: '#6B2D5C' },     // plum
  { slug: 'education', name: 'Education', ink: '#2A4A7B' }, // ink blue
  { slug: 'money', name: 'Money', ink: '#1E5B3C' },         // bottle green
  { slug: 'comic', name: 'Comic', ink: '#B8862B' },         // ochre
  { slug: 'games', name: 'Games', ink: '#2B6E73' },         // teal
] as const;

export type SectionSlug = (typeof sections)[number]['slug'];
