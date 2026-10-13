// The Mayor: everything that can be edited without touching the game.
//
// The game deals one card a week. Someone comes to the Mayor's desk
// with a matter, and the Mayor answers one of two ways. Each answer
// moves some of the four meters. A term ends when any meter runs out
// (0) or runs over (100): too much of a good thing ends a Mayor as
// surely as too little.
import type { Traits } from '../lib/games/mayor-figures';

export const METERS = ['treasury', 'public', 'council', 'press'] as const;
export type Meter = (typeof METERS)[number];

export const METER_NAMES: Record<Meter, string> = {
  treasury: 'Treasury',
  public: 'Public',
  council: 'Council',
  press: 'Press',
};

/** Every meter starts here, out of 100. */
export const START = 50;

// ---- The people ----
// `look` picks the parts of the drawing; the choices are listed in
// src/lib/games/mayor-figures.ts.
export const characters = {
  treasurer: { name: 'The Treasurer', look: { hat: 'eyeshade', whiskers: 'none', eyewear: 'spectacles', neckwear: 'tie' } },
  council: { name: 'The Council President', look: { hat: 'top', whiskers: 'chops', eyewear: 'none', neckwear: 'bowtie' } },
  editor: { name: 'The Editor of the Courier', look: { hat: 'bowler', whiskers: 'moustache', eyewear: 'none', neckwear: 'tie' } },
  citizen: { name: 'A Concerned Citizen', look: { hat: 'bonnet', whiskers: 'none', eyewear: 'spectacles', neckwear: 'brooch' } },
  chief: { name: 'The Chief of Police', look: { hat: 'peaked', whiskers: 'walrus', eyewear: 'none', neckwear: 'collar' } },
  developer: { name: 'A Developer', look: { hat: 'top', whiskers: 'moustache', eyewear: 'monocle', neckwear: 'tie' } },
  steward: { name: 'The Union Steward', look: { hat: 'flat', whiskers: 'beard', eyewear: 'none', neckwear: 'collar' } },
  clerk: { name: 'The City Clerk', look: { hat: 'none', whiskers: 'none', eyewear: 'spectacles', neckwear: 'bowtie' } },
  consultant: { name: 'A Consultant', look: { hat: 'bowler', whiskers: 'none', eyewear: 'monocle', neckwear: 'bowtie' } },
  parks: { name: 'The Parks Commissioner', look: { hat: 'boater', whiskers: 'walrus', eyewear: 'none', neckwear: 'bowtie' } },
} satisfies Record<string, { name: string; look: Traits }>;

export type CharacterId = keyof typeof characters;

// ---- The cards ----
// `left` and `right` are the two answers. `reply` is what the Mayor
// says. The numbers are how far each meter moves: +10 is up ten, -15 is
// down fifteen; leave a meter out and it stays where it is. Keep most
// moves between 5 and 15 so that no single card ends a term from a
// standing start.
export type Answer = { reply: string } & Partial<Record<Meter, number>>;

export interface Card {
  from: CharacterId;
  says: string;
  left: Answer;
  right: Answer;
}

export const cards: Card[] = [
  // The Treasurer
  {
    from: 'treasurer',
    says: 'The pothole on Elm Street has been classified by the state as a pond. We may fill it, or stock it with trout and charge admission.',
    left: { reply: 'Fill it', treasury: -10, public: 10 },
    right: { reply: 'Stock it', treasury: 10, public: -10, press: 5 },
  },
  {
    from: 'treasurer',
    says: 'The annual audit is due. I can present the books as they are, or as they ought to be.',
    left: { reply: 'As they are', treasury: -10, press: 10, council: -5 },
    right: { reply: 'As they ought to be', treasury: 10, press: -15, council: 5 },
  },
  {
    from: 'treasurer',
    says: 'I propose a tax on windows. People are fond of light, and will pay.',
    left: { reply: 'Certainly not', treasury: -5, public: 10 },
    right: { reply: 'Tax them', treasury: 15, public: -15 },
  },
  {
    from: 'treasurer',
    says: 'The pension fund has been invested in a racehorse. It is doing well. Shall we sell, or let it run?',
    left: { reply: 'Sell at once', treasury: 5, council: -5, press: 5 },
    right: { reply: 'Let it run', treasury: 15, press: -10, public: -5 },
  },
  {
    from: 'treasurer',
    says: 'There is a surplus of four hundred dollars. I recommend we hide it before the Council hears.',
    left: { reply: 'Hide it', treasury: 10, council: -10 },
    right: { reply: 'Declare it', treasury: -10, council: 10, public: 5 },
  },

  // The Council President
  {
    from: 'council',
    says: 'The Council wishes to raise its own salaries, in recognition of how hard it has worked on raising its own salaries.',
    left: { reply: 'Veto', council: -15, public: 10, treasury: 5 },
    right: { reply: 'Sign', council: 15, treasury: -10, public: -10 },
  },
  {
    from: 'council',
    says: 'A motion to rename Main Street after myself has passed unanimously. I abstained, out of modesty, and then broke the tie.',
    left: { reply: 'Refuse', council: -10, press: 5 },
    right: { reply: 'Approve', council: 10, treasury: -5, press: -10 },
  },
  {
    from: 'council',
    says: 'A committee has been formed to discover why nothing gets done. It requests three years and a budget.',
    left: { reply: 'Deny it', council: -10, treasury: 5 },
    right: { reply: 'Grant it', council: 10, treasury: -10 },
  },
  {
    from: 'council',
    says: 'My nephew is available to serve as Commissioner of Bridges. He has crossed several.',
    left: { reply: 'Decline', council: -15, press: 10 },
    right: { reply: 'Appoint him', council: 15, press: -15, public: -5 },
  },
  {
    from: 'council',
    says: 'The Council would like its meetings closed to the public, who keep attending.',
    left: { reply: 'Keep them open', council: -10, public: 10, press: 5 },
    right: { reply: 'Close them', council: 10, public: -10, press: -10 },
  },

  // The Editor
  {
    from: 'editor',
    says: 'We have a photograph of you asleep at the ribbon-cutting. Would you care to comment?',
    left: { reply: 'No comment', press: -10 },
    right: { reply: 'I was reflecting', press: 5, public: -5, council: -5 },
  },
  {
    from: 'editor',
    says: 'The Courier could take a warmer view of this administration if the city placed its legal notices with us. All of them. At our rates.',
    left: { reply: 'Decline', press: -10, treasury: 5 },
    right: { reply: 'Agree', press: 15, treasury: -15 },
  },
  {
    from: 'editor',
    says: 'A reporter has asked to see your appointment diary.',
    left: { reply: 'Release it', press: 10, council: -10 },
    right: { reply: 'It has been lost', press: -15, council: 5 },
  },
  {
    from: 'editor',
    says: 'We are short a story for tomorrow. Would you care to do anything?',
    left: { reply: 'Announce an initiative', press: 10, treasury: -10 },
    right: { reply: 'Denounce the Courier', press: -15, public: 10 },
  },
  {
    from: 'editor',
    says: 'Our readers’ poll finds you “tolerable”. Shall we print it?',
    left: { reply: 'Print it', press: 5, public: 5, council: -5 },
    right: { reply: 'Demand a recount', press: -10, public: -5, council: 5 },
  },

  // A Concerned Citizen
  {
    from: 'citizen',
    says: 'The street lamp outside my house has been out since March. I have given it a name.',
    left: { reply: 'Repair the lamp', public: 10, treasury: -10 },
    right: { reply: 'Recognise the name', public: -5, press: 5, treasury: 5 },
  },
  {
    from: 'citizen',
    says: 'My neighbour’s rooster is, in my view, a public nuisance, and in his view, a tenor.',
    left: { reply: 'Ban the rooster', public: 5, press: -5 },
    right: { reply: 'License the rooster', treasury: 5, public: -5, press: 5 },
  },
  {
    from: 'citizen',
    says: 'We should like the park kept open after dark. We promise to behave much as we do in daylight.',
    left: { reply: 'Open it', public: 10, treasury: -5, council: -5 },
    right: { reply: 'Keep it shut', public: -10, treasury: 5 },
  },
  {
    from: 'citizen',
    says: 'This petition, bearing nine thousand signatures, demands that you do something. It does not say what.',
    left: { reply: 'Do something', public: 10, treasury: -10 },
    right: { reply: 'Form a committee', council: 10, public: -10 },
  },
  {
    from: 'citizen',
    says: 'My bus has not come in six days. I should like to know whether to keep waiting.',
    left: { reply: 'Buy buses', public: 15, treasury: -15 },
    right: { reply: 'Advise patience', public: -15, treasury: 5, press: -5 },
  },

  // The Chief of Police
  {
    from: 'chief',
    says: 'Crime is down. We stopped counting it. Shall I announce this?',
    left: { reply: 'Announce it', public: 10, press: -10 },
    right: { reply: 'Resume counting', public: -10, press: 10, treasury: -5 },
  },
  {
    from: 'chief',
    says: 'The force requires a cavalry. Horses are a deterrent, mostly to the officers.',
    left: { reply: 'Deny it', treasury: 5, council: -5 },
    right: { reply: 'Fund it', treasury: -15, public: 5, council: 5 },
  },
  {
    from: 'chief',
    says: 'We have arrested the Courier’s theatre critic over a review. The cast insisted.',
    left: { reply: 'Release him', press: 10, public: -5 },
    right: { reply: 'Hold him', press: -20, public: 10 },
  },
  {
    from: 'chief',
    says: 'Two rival societies have applied to parade down the same street at the same hour.',
    left: { reply: 'Permit both', public: 10, treasury: -10, press: 5 },
    right: { reply: 'Permit neither', public: -10, council: 5 },
  },

  // A Developer
  {
    from: 'developer',
    says: 'I should like to build luxury flats on the old cemetery. The current residents have raised no objection.',
    left: { reply: 'Refuse', public: 10, treasury: -10, council: -5 },
    right: { reply: 'Approve', treasury: 20, public: -15, press: -5 },
  },
  {
    from: 'developer',
    says: 'A stadium. The city pays, I profit, and a team may come. It is the standard arrangement.',
    left: { reply: 'Decline', treasury: 5, council: -10, public: -5 },
    right: { reply: 'Build it', treasury: -20, public: 10, council: 10 },
  },
  {
    from: 'developer',
    says: 'I will repave Main Street at my own expense, provided it is thereafter known as Brannigan’s Main Street.',
    left: { reply: 'Refuse', treasury: -10, public: 5 },
    right: { reply: 'Accept', treasury: 10, public: -5, press: -10 },
  },

  // The Union Steward
  {
    from: 'steward',
    says: 'The sanitation men want a raise. Failing that, they will go on collecting the rubbish, and bring it here.',
    left: { reply: 'Grant the raise', treasury: -15, public: 5 },
    right: { reply: 'Refuse', treasury: 5, public: -15, press: -5 },
  },
  {
    from: 'steward',
    says: 'The clerks request chairs.',
    left: { reply: 'Chairs', treasury: -5, council: -5, public: 5 },
    right: { reply: 'Standing builds character', treasury: 5, public: -10, press: -5 },
  },
  {
    from: 'steward',
    says: 'The men want Fridays made shorter. In exchange, Mondays will be attempted.',
    left: { reply: 'Agreed', public: 10, council: -10 },
    right: { reply: 'Refused', public: -10, council: 10 },
  },

  // The City Clerk
  {
    from: 'clerk',
    says: 'We have run out of Form 27-B, which is the form that authorises the printing of Form 27-B.',
    left: { reply: 'Print it anyway', council: -10, public: 5 },
    right: { reply: 'Suspend all business', council: 5, public: -10, treasury: 5 },
  },
  {
    from: 'clerk',
    says: 'The city charter turns out to forbid mayors. It is a misprint, but a binding one.',
    left: { reply: 'Amend the charter', council: -10, treasury: -5, press: 5 },
    right: { reply: 'Tell no one', council: 10, press: -15 },
  },
  {
    from: 'clerk',
    says: 'Your signature is required on these four hundred documents. I should not read them, in your position.',
    left: { reply: 'Read them', council: -10, press: 10 },
    right: { reply: 'Sign them', council: 10, treasury: -10 },
  },

  // A Consultant
  {
    from: 'consultant',
    says: 'For a fee, I will tell you what the public thinks. For a larger fee, I will tell you something else.',
    left: { reply: 'The small fee', treasury: -5, public: 10 },
    right: { reply: 'The larger fee', treasury: -15, press: 10, council: 5 },
  },
  {
    from: 'consultant',
    says: 'The city needs a slogan. I have prepared several: “A City.” “Still Here.” “Mind the Hole.”',
    left: { reply: 'No slogan', treasury: 5, press: -5 },
    right: { reply: 'Buy one', treasury: -10, press: 10, public: 5 },
  },
  {
    from: 'consultant',
    says: 'My report finds that the city employs too many consultants. I am prepared to stay on and oversee the reductions.',
    left: { reply: 'Dismiss him', treasury: 10, council: -5 },
    right: { reply: 'Retain him', treasury: -10, council: 5, press: -5 },
  },

  // The Parks Commissioner
  {
    from: 'parks',
    says: 'The ducks have left the pond. I believe it is personal.',
    left: { reply: 'Buy new ducks', treasury: -5, public: 10 },
    right: { reply: 'Issue a statement', press: 5, public: -5 },
  },
  {
    from: 'parks',
    says: 'The founder’s statue is leaning. We can straighten it, or declare the lean historic.',
    left: { reply: 'Straighten it', treasury: -10, public: 5, council: 5 },
    right: { reply: 'Declare it historic', treasury: 5, press: 5, council: -5 },
  },
  {
    from: 'parks',
    says: 'A tree has fallen across the doors of the Council chamber. The Council is inside and, for once, unanimous.',
    left: { reply: 'Remove the tree', council: 15, treasury: -10 },
    right: { reply: 'Preserve the tree', council: -15, public: 10, press: 5 },
  },
  {
    from: 'parks',
    says: 'The band for the summer concerts would like to be paid this year.',
    left: { reply: 'Pay them', treasury: -10, public: 10 },
    right: { reply: 'Offer them exposure', treasury: 5, public: -5, press: -5 },
  },
];

// ---- How a term ends ----
// One ending for each meter running out, and one for each running over.
export const endings: Record<Meter, Record<'empty' | 'full', { title: string; text: string; by: string }>> = {
  treasury: {
    empty: {
      title: 'The City Is Bankrupt',
      text: 'The bailiffs have taken the chain of office and, after some discussion, the chair. You are asked to leave by the door, which is next.',
      by: 'the Treasury (empty)',
    },
    full: {
      title: 'Indicted for Solvency',
      text: 'No city has ever had this much money honestly. The state’s auditors have assumed the worst and are, on the law of averages, probably right.',
      by: 'the Treasury (suspiciously full)',
    },
  },
  public: {
    empty: {
      title: 'Recalled by Popular Demand',
      text: 'The recall petition was signed by more people than live in the city. Several dogs are understood to have taken part.',
      by: 'the Public (furious)',
    },
    full: {
      title: 'Carried Off in Triumph',
      text: 'A grateful crowd lifted you onto its shoulders and bore you through the streets, out of the city, and, by the latest report, toward the state capital. You have not been set down.',
      by: 'the Public (adoring)',
    },
  },
  council: {
    empty: {
      title: 'Impeached',
      text: 'The vote was unanimous, which the Council has not managed on any other subject in forty years. They have thanked you for bringing them together.',
      by: 'the Council (united against you)',
    },
    full: {
      title: 'Abolished by Friends',
      text: 'The Council, finding itself in perfect agreement with you on everything, has concluded that one of you is unnecessary and voted accordingly.',
      by: 'the Council (devoted)',
    },
  },
  press: {
    empty: {
      title: 'Resigned, Says Courier',
      text: 'You learned of your resignation from the morning edition. By the evening edition it had been accepted.',
      by: 'the Press (hostile)',
    },
    full: {
      title: 'Too Well Reviewed',
      text: 'Coverage this warm could only have been paid for. A rival paper has opened an inquiry, and the Courier, to prove its independence, has joined it.',
      by: 'the Press (fawning)',
    },
  },
};

// ---- Ranks ----
// By weeks in office. `from` is the fewest weeks for the rank.
export const ranks = [
  { from: 0, name: 'Mayor, Briefly', blurb: 'The portrait had not yet been hung. It has been returned to the framer.' },
  { from: 8, name: 'Caretaker', blurb: 'Long enough to learn where the lavatories are, and to be blamed for them.' },
  { from: 16, name: 'One-Term Mayor', blurb: 'A respectable innings. A small street may be named for you, in a district nobody visits.' },
  { from: 28, name: 'Fixture of City Hall', blurb: 'They had begun to think you came with the building.' },
  { from: 45, name: 'Mayor for Life, Give or Take', blurb: 'An administration of historic length. Historians will be along shortly to find out how.' },
];
