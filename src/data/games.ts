// The games on the /games hub, in the order they appear.
//
// `live: false` shows the card as "Under Construction by the Bureau of
// Amusement" with no link. Flip it to true when the game's page exists
// at /games/<slug>.
// `image` is a file from public/illustrations (with a credits.json entry).

export interface Game {
  slug: string;
  name: string;
  /** One line, in house voice. */
  blurb: string;
  image: string;
  live: boolean;
}

export const games: Game[] = [
  {
    slug: 'real-or-absurdist',
    name: 'Real or Absurdist',
    blurb: 'Ten headlines. Some were printed by reputable newspapers. The rest were printed by us. The difference is narrowing.',
    image: 'pantagruel-08.webp',
    live: true,
  },
  {
    slug: 'policy-reversal',
    name: 'Policy Reversal',
    blurb: 'Guess the five-letter word. The administration reserves the right to change it whenever you get close.',
    image: 'pantagruel-06.webp',
    live: true,
  },
  {
    slug: 'personality-quiz',
    name: 'The Personality Quiz',
    blurb: 'Twelve questions to establish, for the record, which municipal department you are.',
    image: 'pantagruel-05.webp',
    live: true,
  },
  {
    slug: 'authors-and-faces',
    name: 'Authors & Faces',
    blurb: 'Match the great writer to the face, the name, or the famous line. All are long dead and unable to object.',
    image: 'pantagruel-03.webp',
    live: true,
  },
  {
    slug: 'crossword',
    name: 'The Crossword',
    blurb: 'A daily grid containing no errors that were not intended.',
    image: 'pantagruel-04.webp',
    live: true,
  },
  {
    slug: 'caption-contest',
    name: 'The Caption Contest',
    blurb: 'We supply the drawing. You supply the words. The editors supply the disappointment.',
    image: 'pantagruel-09.webp',
    live: true,
  },
  {
    slug: 'the-mayor',
    name: 'The Mayor',
    blurb: 'Govern a city one decision at a time. Mind the Treasury, the Public, the Council, and the Press.',
    image: 'pantagruel-12.webp',
    live: false,
  },
];
