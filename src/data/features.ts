// The recurring features in the strip on the front page. Edit the text
// here and the page follows; nothing else needs to change.
//
// Each feature has a `title` and either `text` (one item) or `items`
// (a short list). Keep them brief: these are small boxes.

export interface Feature {
  title: string;
  /** A large figure shown above the text, for "Today's Number". */
  figure?: string;
  text?: string;
  items?: string[];
}

export const features: Feature[] = [
  {
    title: 'Weather',
    text: 'Overcast, with a chance of committee. Winds from the direction of whoever spoke last. Outlook for the weekend: under review.',
  },
  {
    title: 'Notices to the Public',
    items: [
      'The fountain in Founders Square is closed for repairs to the sign saying it is closed.',
      'Residents are reminded that Tuesday has been moved to Wednesday for the duration of the works.',
      'Lost: one municipal budget, last seen in good condition. Reward.',
    ],
  },
  {
    title: 'Today’s Number',
    figure: '14',
    text: 'Subcommittees currently studying why there are so many subcommittees.',
  },
];
