// The crosswords. One is printed each day, in this order, starting again
// from the top when the list runs out (see pickDaily in
// src/lib/games/daily.ts). Add a puzzle to the END of the list so the
// ones already scheduled do not move.
//
// How to write one:
//   grid    One string per row, one character per square. A letter is a
//           white square holding that letter; # is a black square.
//           Every row must be the same length.
//   across  A clue for every word reading left to right, written as
//           ANSWER: 'clue'. The order does not matter.
//   down    The same for every word reading top to bottom.
//
// The clue numbers are worked out from the grid, so they are never
// typed here. If a clue is missing, or names a word that is not in the
// grid, the build stops and says which (see src/lib/games/crossword.ts).
// So a puzzle with a mistake in it cannot be published by accident.

export interface Crossword {
  /** Printed as "Set by ...". A reader's name, for a submitted puzzle. */
  setter: string;
  grid: string[];
  across: Record<string, string>;
  down: Record<string, string>;
}

const BUREAU = 'the Bureau of Amusement';

export const crosswords: Crossword[] = [
  {
    setter: BUREAU,
    grid: ['HER##', 'IRON#', 'MAYOR', '#SANE', '##LED'],
    across: {
      HER: 'Pronoun for the Councilwoman, when the minutes are being kind',
      IRON: 'Metal of the mayoral fist, and of the appliance that pressed his shirt',
      MAYOR: 'Official elected to cut ribbons and absorb blame',
      SANE: 'Of sound mind; no longer a requirement of office',
      LED: 'Guided; what the city is said to have been',
    },
    down: {
      HIM: 'Pronoun for the Mayor, when the blame is being assigned',
      ERAS: 'Long ages, such as those spent waiting at the Permit Office',
      ROYAL: 'Fit for a king; how the Mayor prefers his welcome',
      NONE: 'Not any; the number of potholes filled this quarter',
      RED: 'Colour of municipal tape and municipal ink',
    },
  },
  {
    setter: BUREAU,
    grid: ['##MAP', '#MEMO', 'AUDIT', 'GLAD#', 'EEL##'],
    across: {
      MAP: 'Chart on which the proposed bypass is shown passing through your kitchen',
      MEMO: 'Office note, sent to all staff and read by none',
      AUDIT: 'Formal examination of the books, usually scheduled after the books have left',
      GLAD: 'Pleased; the Mayor is always this to be here',
      EEL: 'Slippery fish, often compared to an alderman, unfairly to the fish',
    },
    down: {
      AGE: 'Number of years; the Council’s is not discussed',
      MULE: 'Stubborn animal: half a horse, and all of the Zoning Board',
      MEDAL: 'Award pinned to the chest of whoever organised the ceremony',
      AMID: 'In the middle of, as in “___ growing calls to resign”',
      POT: 'Kitchen vessel, or the first half of a road hazard',
    },
  },
  {
    setter: BUREAU,
    grid: ['OLD##', 'FARM#', 'FRAUD', '#KITE', '##NEW'],
    across: {
      OLD: 'Aged, like the plumbing at City Hall',
      FARM: 'Rural holding, lately rezoned as luxury flats',
      FRAUD: 'Deception for gain. See also: consultancy',
      KITE: 'Toy flown on a string, now requiring a permit',
      NEW: 'Recently made; how the stadium was described in 1974',
    },
    down: {
      OFF: 'Not on; the state of the street lamps since March',
      LARK: 'Songbird, or a bit of fun had at the taxpayer’s expense',
      DRAIN: 'Roadside grate, and what the bypass did to the budget',
      MUTE: 'Silent; also the button the Chairman cannot find',
      DEW: 'Morning moisture, the only water now reaching Ward Six',
    },
  },
  {
    setter: BUREAU,
    grid: ['##PRO', '#PLAN', 'ELATE', 'VOTE#', 'EYE##'],
    across: {
      PRO: 'In favour; a position rarely heard at public meetings',
      PLAN: 'Scheme of action. The city has had several',
      ELATE: 'Fill with joy, as a cancelled meeting does',
      VOTE: 'Ballot, counted in most wards once',
      EYE: 'Organ the Council turns blind',
    },
    down: {
      EVE: 'The night before, which is when the report is written',
      PLOY: 'Cunning manoeuvre, such as holding the hearing at six in the morning',
      PLATE: 'Dinner dish, five hundred dollars each at the fundraiser',
      RATE: 'Local tax, or the speed at which it rises',
      ONE: 'Single; the number of bidders for the contract',
    },
  },
  {
    setter: BUREAU,
    grid: ['##FOG', '#RAGE', 'COURT', 'ABLE#', 'NET##'],
    across: {
      FOG: 'Thick mist, in which the Committee is understood to be operating',
      RAGE: 'Fury, as felt at the parking office',
      COURT: 'Place of law, where the city’s contractors eventually meet',
      ABLE: 'Competent. See also: not applicable',
      NET: 'What remains after deductions; also used to catch fish',
    },
    down: {
      CAN: 'Tin container, customarily kicked down the road',
      ROBE: 'Garment of a judge at work, or a Mayor at home',
      FAULT: 'Blame; always the previous administration’s',
      OGRE: 'Fairy-tale monster; the Treasurer, to his staff',
      GET: 'Obtain, as one does a permit, in theory',
    },
  },
  {
    setter: BUREAU,
    grid: ['##POP', '#FINE', 'ELECT', 'RACE#', 'APE##'],
    across: {
      POP: 'Sound of a tyre meeting a pothole',
      FINE: 'Penalty for parking, or the Mayor’s word for how things are going',
      ELECT: 'Choose by ballot, then regret',
      RACE: 'Contest for office; also what candidates do from questions',
      APE: 'Primate, once considered for Parks Commissioner; or to mimic',
    },
    down: {
      ERA: 'Age, named for whoever was Mayor during it',
      FLAP: 'Minor public fuss, lasting one news cycle',
      PIECE: 'Portion; everyone on the Council wants one of the action',
      ONCE: 'A single time; how often the bridge was inspected',
      PET: 'Favourite, as in the Mayor’s ___ project',
    },
  },
  {
    setter: BUREAU,
    grid: ['#STIR', 'STONE', 'TAKEN', 'ALERT', 'BENT#'],
    across: {
      STIR: 'Mix with a spoon, or cause a commotion at a zoning hearing',
      STONE: 'Material of the founder’s statue and the clerk’s expression',
      TAKEN: 'Occupied or removed: every seat at the meeting, and the petty cash',
      ALERT: 'Warning to the public, who are advised to remain calm',
      BENT: 'Not straight; an old word for a certain kind of official',
    },
    down: {
      STAB: 'Wound with a knife; in politics, traditionally in the back',
      STALE: 'No longer fresh, like the sandwiches at the hearing',
      TOKEN: 'Small gesture; also what the subway once accepted',
      INERT: 'Motionless, like the Committee on Progress',
      RENT: 'Monthly sum paid for the privilege of a ceiling',
    },
  },
];
