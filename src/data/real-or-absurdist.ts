// Headlines for Real or Absurdist.
//
// Two kinds:
//   isReal: false  one of OURS. sourceUrl and sourceName stay empty.
//   isReal: true   a headline a real publication actually printed, with
//                  a link to it. The game shows the link after the
//                  reader answers.
//
// TO ADD A REAL HEADLINE: copy one of the real lines below and give it
// the exact headline, the address of the article, and the name of the
// publication. A line with any of the three left empty is ignored.
// Never put an invented headline in as real.
//
// The game needs at least FIVE real headlines to be open to the public.
// A mix of publications and subjects makes it harder: at present the
// real ones are all from one source.

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

  // ---------- Real ----------
  // Taken from UPI's Odd News feed on 13 October 2026, headline and link
  // together. Where UPI's feed puts "Watch:" or "Look:" in front of a
  // headline (its label for a story with video or photos), the label is
  // left off. To add more, copy a line and change the three values.
  { text: 'Pikachu takes guided tour of International Space Station', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/07/Pikachu-European-Space-Agency-International-Space-Station/6211791387825/', sourceName: 'UPI' },
  { text: 'S.C. man buys 50 tickets for one lottery drawing, wins 50 times', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/05/lotto-South-Carolina-Education-Lottery-Pick-4-50-tickets/4691791219622/', sourceName: 'UPI' },
  { text: 'Pious raccoon visits Catholic church in New York City', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/05/raccoon-St-Josephs-church-new-york/7791791220402/', sourceName: 'UPI' },
  { text: 'Sewer workers find class ring that had been missing for decades', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/08/class-ring-sewer-Sheffield-Alabama/7991791477667/', sourceName: 'UPI' },
  { text: 'Kangaroo escapes Missouri petting zoo, spends a day on the loose', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/06/Marshall-Missouri-kangaroo-escape-petting-zoo/1351791299711/', sourceName: 'UPI' },
  { text: 'Maryland in-laws collect their second $50,000 lottery prize together', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/07/lotto-Maryland-Lottery-in-laws-second-win/2841791395601/', sourceName: 'UPI' },
  { text: 'Bear wanders through Pennsylvania restaurant, raids dumpster', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/05/bear-Jubilee-Restaurant-Pocono-Pines/5481791217525/', sourceName: 'UPI' },
  { text: 'Home renovation project leads to discovery of wallet lost for 51 years', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/06/canada-dartmouth-nova-scotia-lost-wallet-51-years/7671791307060/', sourceName: 'UPI' },
  { text: '1,474 pounds of french fries break world record in Idaho', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/07/Guinness-World-Records-largest-serving-french-fries/1951791396507/', sourceName: 'UPI' },
  { text: 'Lottery ticket forgotten for four months turns out to be big winner', isReal: true, sourceUrl: 'https://www.upi.com/Odd_News/2026/10/06/lotto-Ohio-Lottery-forgotten-Pick-5-ticket/4401791305171/', sourceName: 'UPI' },
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
