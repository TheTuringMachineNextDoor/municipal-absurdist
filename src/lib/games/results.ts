// Fills in and reveals a ResultsCard (see ResultsCard.astro), and makes
// its Share button copy the text result. Shared by every game.
import type { GameStats } from './stats';

export interface Results {
  /** e.g. "7 out of 10" */
  score: string;
  /** e.g. "Deputy Skeptic" */
  rank: string;
  /** A sentence in house voice about that rank. */
  blurb: string;
  /** What the Share button copies: a few lines of plain text. */
  shareText: string;
  stats: GameStats;
  /** Optional extra line, e.g. "A new edition is printed at midnight." */
  note?: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // older browsers, or permission refused
  }
}

export function showResults(card: HTMLElement, results: Results) {
  const set = (hook: string, text: string) => {
    const el = card.querySelector<HTMLElement>(`[data-results-${hook}]`);
    if (el) el.textContent = text;
  };
  set('score', results.score);
  set('rank', results.rank);
  set('blurb', results.blurb);
  set('text', results.shareText);
  set('note', results.note ?? '');
  set('played', String(results.stats.played));
  set('best', String(results.stats.best));
  set('streak', String(results.stats.streak));

  const button = card.querySelector<HTMLButtonElement>('[data-results-share]');
  const status = card.querySelector<HTMLElement>('[data-results-status]');
  const textBox = card.querySelector<HTMLElement>('[data-results-text]');
  if (button && !button.dataset.wired) {
    button.dataset.wired = 'true';
    button.addEventListener('click', async () => {
      const copied = await copyText(textBox?.textContent ?? '');
      if (copied) {
        if (status) status.textContent = 'Copied. Paste it wherever it will cause the most trouble.';
      } else if (textBox) {
        // Could not copy: select the text so the reader can copy it by hand.
        const range = document.createRange();
        range.selectNodeContents(textBox);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        if (status) status.textContent = 'The result is selected. Copy it by hand.';
      }
    });
  }

  card.hidden = false;
  // Move keyboard and screen-reader attention to the result.
  card.focus();
}
