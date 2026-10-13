// The six sections of the paper, in masthead order. The nav reads from
// this list now; the article content collection will reuse the slugs in
// Phase 2, so a section is only ever named in one place.

//
// `blurb` is the line under the section's name on its own page.
// `ink` is the colour of the stroke that glides across the section's
// name in the nav when the pointer is over it.

export const sections = [
  { slug: 'politics', name: 'Politics', ink: '#A8321F', blurb: 'World affairs, national politics, state and local government, and the bureaucracy that outlives them all.' },   // vermilion
  { slug: 'culture', name: 'Culture', ink: '#6B2D5C', blurb: 'Entertainment, technology, the internet, and other things people do instead of sleeping.' },     // plum
  { slug: 'education', name: 'Education', ink: '#2A4A7B', blurb: 'Schools, universities, and the life of the mind, such as it is.' }, // ink blue
  { slug: 'money', name: 'Money', ink: '#1E5B3C', blurb: 'Business, work, housing, and the rising cost of having any of them.' },         // bottle green
  { slug: 'comic', name: 'Comic', ink: '#B8862B', blurb: 'Editorial cartoons, caricatures, and strips, for readers who have had enough words.' },         // ochre
  { slug: 'games', name: 'Games', ink: '#2B6E73', blurb: 'Quizzes, puzzles, and crosswords. Answers are printed when the editors find them.' },         // teal
] as const;

export type SectionSlug = (typeof sections)[number]['slug'];
