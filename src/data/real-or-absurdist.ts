// Headlines for Real or Absurdist.
//
// Two kinds:
//   isReal: false  one of OURS. sourceUrl and sourceName stay empty.
//   isReal: true   a headline a real publication actually printed, with
//                  a link to it. The game shows the link after the
//                  reader answers.
//
// TO ADD A REAL HEADLINE: fill in one of the TODO slots at the bottom
// with the exact headline, the address of the article, and the name of
// the publication. A slot with any field left empty is ignored. Never
// put an invented headline in a real slot.
//
// The game needs at least FIVE finished real headlines before it opens
// to the public. Until then it can only be played while developing
// (npm run dev), where every answer is "Absurdist".

export interface Headline {
  text: string;
  isReal: boolean;
  sourceUrl: string;
  sourceName: string;
}

const entries: Headline[] = [
  // ---------- Ours ----------
  { text: 'City Installs Speed Bumps on Bike Path to Slow Down Pedestrians', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Council Votes Unanimously to Table Motion on Whether Votes Should Be Unanimous', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Airline Introduces Fee for Passengers Who Decline to Pay Fees', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Study Finds Nine in Ten Studies Could Have Been an Email', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Transit Authority Unveils Express Train That Skips Every Station, Including the Last', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'School District Bans Banned Books List for Containing Titles of Banned Books', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Local Man Completes Terms of Service, Finds He Agreed to Jury Duty in Delaware', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Housing Committee Meets in Rented Hall, Is Priced Out by Second Session', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Mayor Declares War on Potholes; Potholes Win Decisive Early Victory on Elm Street', isReal: false, sourceUrl: '', sourceName: '' },
  { text: 'Technology Firm Lays Off Team Responsible for Announcing Layoffs', isReal: false, sourceUrl: '', sourceName: '' },

  // ---------- Real: TODO, fill these in ----------
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 1
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 2
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 3
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 4
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 5
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 6
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 7
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 8
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 9
  { text: '', isReal: true, sourceUrl: '', sourceName: '' }, // TODO real headline 10
];

/** Ours, ready to play. */
export const ourHeadlines = entries.filter((h) => !h.isReal && h.text);

/** Real ones with every field filled in. Unfinished TODO slots drop out. */
export const realHeadlines = entries.filter((h) => h.isReal && h.text && h.sourceUrl && h.sourceName);

/** How many real headlines the game needs before it opens to the public. */
export const REAL_HEADLINES_NEEDED = 5;
export const realOrAbsurdistReady = realHeadlines.length >= REAL_HEADLINES_NEEDED;

/** Cards in a round. */
export const ROUND_LENGTH = 10;
