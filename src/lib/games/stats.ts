// Game statistics, kept in the reader's own browser (localStorage).
// Shared by every game: each passes its own id, e.g. "real-or-absurdist".
//
// Every read and write is wrapped in try/catch because storage can be
// missing or blocked (private windows, strict settings). A game must
// still be playable then; it just will not remember.

export interface GameStats {
  /** Rounds finished. */
  played: number;
  /** Best score so far. */
  best: number;
  /** Days in a row with a finished round. */
  streak: number;
  /** The date key ("2026-10-13") of the last finished round. */
  lastPlayed: string | null;
  /** What happened in that round, so it can be shown again on return. */
  lastResult: RoundResult | null;
}

export interface RoundResult {
  score: number;
  /** One entry per question, true if right. Games without questions
      leave it empty. */
  marks: boolean[];
  /** Anything else a game wants back, as text (e.g. its share grid). */
  detail?: string;
}

const empty: GameStats = { played: 0, best: 0, streak: 0, lastPlayed: null, lastResult: null };
const storageKey = (gameId: string) => `absurdist:game:${gameId}`;

export function readStats(gameId: string): GameStats {
  try {
    const saved = localStorage.getItem(storageKey(gameId));
    return saved ? { ...empty, ...JSON.parse(saved) } : { ...empty };
  } catch {
    return { ...empty };
  }
}

/** Record a finished round and return the updated statistics.
    `yesterdayKey` is needed to tell whether the streak continues. */
export function recordResult(
  gameId: string,
  dateKey: string,
  yesterdayKey: string,
  result: RoundResult,
  /** Pass true for games where a low score is the good one. */
  lowerIsBetter = false,
): GameStats {
  const stats = readStats(gameId);
  if (stats.lastPlayed === dateKey) return stats; // today already counted

  const next: GameStats = {
    played: stats.played + 1,
    best:
      stats.played === 0
        ? result.score
        : lowerIsBetter
          ? Math.min(stats.best, result.score)
          : Math.max(stats.best, result.score),
    streak: stats.lastPlayed === yesterdayKey ? stats.streak + 1 : 1,
    lastPlayed: dateKey,
    lastResult: result,
  };
  try {
    localStorage.setItem(storageKey(gameId), JSON.stringify(next));
  } catch {
    // Not saved; the results card still shows this round.
  }
  return next;
}
