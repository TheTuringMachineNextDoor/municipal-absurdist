// The daily puzzle helper, shared by every game.
//
// "Today" means today in Chicago, wherever the reader is, so everyone
// gets the same puzzle and it changes for everyone at the same moment
// (midnight Central time).

/** Today's date in America/Chicago as "2026-10-13". */
export function chicagoDateKey(now: Date = new Date()): string {
  // The en-CA locale happens to write dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** "13 October 2026", for showing a date key to readers. */
export function formatDateKey(key: string): string {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Whole days from the Unix epoch to a date key. Goes up by one a day. */
export function dayNumber(key: string): number {
  const [year, month, day] = key.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/** Today's puzzle from a list: one per day, in order, starting again
    from the top when the list runs out. */
export function pickDaily<T>(puzzles: readonly T[], key: string = chicagoDateKey()): T {
  return puzzles[dayNumber(key) % puzzles.length];
}

/** A random-number generator that gives the same numbers every time for
    the same seed (the algorithm is called mulberry32). Math.random()
    cannot do this, and a daily puzzle must be the same for everyone. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A shuffled copy of a list, the same shuffle every time for the same
    seed. Pass dayNumber(key) to shuffle differently each day. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const random = seededRandom(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
