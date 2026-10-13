// The caption contests, oldest first. The LAST one in the list is the
// contest now open; the ones before it are shown beneath as past
// results.
//
// To run a new contest: add an entry at the end with its drawing and
// closing date. To announce a result: fill in `winner` (and, if you
// like, `runnersUp`) on the contest that has closed. A past contest
// with no winner yet is shown as "still deliberating".
//
// `image` is a file from public/illustrations with an entry in
// credits.json. Use only drawings we may print: public domain, or made
// for us.

export interface Caption {
  text: string;
  /** The name to print. */
  by: string;
}

export interface CaptionContest {
  /** Printed as "No. 1". Also sent to the form with each entry. */
  number: number;
  image: string;
  /** The last day for entries, as YYYY-MM-DD. */
  closes: string;
  winner?: Caption;
  runnersUp?: Caption[];
  /** A line of explanation printed with the result, if one is needed. */
  note?: string;
  /** Placeholder content to delete before launch. */
  sample?: boolean;
}

export const captionContests: CaptionContest[] = [
  {
    // A made-up trial among our made-up staff, so the page has a past
    // result to show. Delete it once a real contest has been judged.
    number: 0,
    image: 'pantagruel-02.webp',
    closes: '2026-10-06',
    winner: {
      text: 'The Water Commissioner assures residents that the supply is perfectly safe.',
      by: 'Ottoline Fenwick-Drab',
    },
    runnersUp: [
      { text: 'The Council adjourns for a brief recess, now in its fourth day.', by: 'Cornelius P. Wetherby' },
      { text: '“I can stop whenever the budget does.”', by: 'The Comics Desk' },
    ],
    note: 'A trial contest, held among the staff to test the machinery. The staff are otherwise ineligible.',
    sample: true,
  },
  {
    number: 1,
    image: 'pantagruel-11.webp',
    closes: '2026-10-27',
  },
];
