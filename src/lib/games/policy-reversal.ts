// The rules of Policy Reversal, with nothing about the page in them.
//
// The administration never really picks a word. It keeps a list of every
// word it could still claim to have meant (the "positions"). After each
// guess it works out, for every position, what the tiles would show; it
// then gives whichever answer leaves it the most positions to retreat
// to. It only concedes when one position is left and you have named it.

/** Feedback for one guess, one character per letter:
    "g" right letter, right place; "y" right letter, wrong place;
    "x" not in the word. */
export type Pattern = string;

export const SOLVED: Pattern = 'ggggg';

/** What the tiles show if `answer` is the word and `guess` is guessed.
    Repeated letters are handled as in Wordle: a letter is only marked
    as many times as it appears in the answer, right-place ones first. */
export function feedback(guess: string, answer: string): Pattern {
  const marks = Array<string>(guess.length).fill('x');
  const unused: Record<string, number> = {};

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) marks[i] = 'g';
    else unused[answer[i]] = (unused[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (marks[i] === 'x' && unused[guess[i]] > 0) {
      marks[i] = 'y';
      unused[guess[i]] -= 1;
    }
  }
  return marks.join('');
}

/** How much a pattern gives away: right-place letters count double. */
const generosity = (pattern: Pattern) =>
  [...pattern].reduce((sum, mark) => sum + (mark === 'g' ? 2 : mark === 'y' ? 1 : 0), 0);

/** The administration's reply to a guess: the feedback it chooses to
    give, and the positions still open to it afterwards. */
export function respond(positions: string[], guess: string): { pattern: Pattern; positions: string[] } {
  // Sort the positions into piles by the feedback each would produce.
  const piles = new Map<Pattern, string[]>();
  for (const word of positions) {
    const pattern = feedback(guess, word);
    const pile = piles.get(pattern);
    if (pile) pile.push(word);
    else piles.set(pattern, [word]);
  }

  // Take the biggest pile. It will not admit defeat while any other
  // pile exists; between piles of equal size it gives away the least;
  // and a final alphabetical comparison makes the choice the same for
  // every reader.
  const ranked = [...piles.entries()].sort(([a, pileA], [b, pileB]) => {
    if ((a === SOLVED) !== (b === SOLVED)) return a === SOLVED ? 1 : -1;
    if (pileA.length !== pileB.length) return pileB.length - pileA.length;
    if (generosity(a) !== generosity(b)) return generosity(a) - generosity(b);
    return a < b ? -1 : 1;
  });

  const [pattern, remaining] = ranked[0];
  return { pattern, positions: remaining };
}
