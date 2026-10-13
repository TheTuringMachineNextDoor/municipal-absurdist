// Turns a crossword as written in src/data/crosswords.ts (rows of
// letters, clues listed by answer) into what the page needs: numbered
// squares and a list of entries, each knowing which squares it covers.
//
// It also checks the puzzle, and throws an error describing the first
// thing wrong. The crossword page runs this on every puzzle while the
// site is being built, so a faulty puzzle stops the build.
import type { Crossword } from '../../data/crosswords';

export type Direction = 'across' | 'down';

export interface Entry {
  /** The clue number printed in the entry's first square. */
  number: number;
  direction: Direction;
  answer: string;
  clue: string;
  /** The squares it covers, in order. Each is an index into `cells`. */
  cells: number[];
}

export interface Cell {
  /** The right letter, or null for a black square. */
  letter: string | null;
  /** The clue number printed in the corner, if a word starts here. */
  number: number | null;
  /** Which entry runs through this square each way: an index into
      `entries`, or null if none does. */
  across: number | null;
  down: number | null;
}

export interface Layout {
  columns: number;
  rows: number;
  /** Every square, left to right then top to bottom. */
  cells: Cell[];
  /** Every entry: all the acrosses in number order, then the downs. */
  entries: Entry[];
}

const BLACK = '#';

export function layOut(puzzle: Crossword, name = 'A crossword'): Layout {
  const rows = puzzle.grid.length;
  const columns = puzzle.grid[0]?.length ?? 0;
  const fail = (problem: string): never => {
    throw new Error(`${name}: ${problem}`);
  };

  if (rows === 0 || columns === 0) fail('the grid is empty.');
  for (const row of puzzle.grid) {
    if (row.length !== columns) fail(`the row "${row}" is not ${columns} squares long like the first.`);
    if (!/^[A-Z#]+$/.test(row)) fail(`the row "${row}" may only contain capital letters and #.`);
  }

  const at = (row: number, column: number) =>
    row < 0 || column < 0 || row >= rows || column >= columns ? BLACK : puzzle.grid[row][column];
  const isWhite = (row: number, column: number) => at(row, column) !== BLACK;

  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      cells.push({ letter: isWhite(row, column) ? at(row, column) : null, number: null, across: null, down: null });
    }
  }

  // Numbering, the way every crossword does it: go through the squares
  // in reading order, and give the next number to any white square where
  // a word starts (nothing before it, and at least one square after).
  const acrosses: Entry[] = [];
  const downs: Entry[] = [];
  let number = 0;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (!isWhite(row, column)) continue;
      const startsAcross = !isWhite(row, column - 1) && isWhite(row, column + 1);
      const startsDown = !isWhite(row - 1, column) && isWhite(row + 1, column);
      if (!startsAcross && !startsDown) continue;

      number += 1;
      cells[row * columns + column].number = number;

      if (startsAcross) {
        const covered: number[] = [];
        for (let c = column; isWhite(row, c); c++) covered.push(row * columns + c);
        acrosses.push({ number, direction: 'across', answer: '', clue: '', cells: covered });
      }
      if (startsDown) {
        const covered: number[] = [];
        for (let r = row; isWhite(r, column); r++) covered.push(r * columns + column);
        downs.push({ number, direction: 'down', answer: '', clue: '', cells: covered });
      }
    }
  }

  const entries = [...acrosses, ...downs];
  const seen = new Set<string>();
  entries.forEach((entry, index) => {
    entry.answer = entry.cells.map((cell) => cells[cell].letter).join('');
    const clue = puzzle[entry.direction][entry.answer];
    const where = `${entry.number} ${entry.direction} (${entry.answer})`;
    if (!clue) fail(`${where} has no clue.`);
    if (entry.answer.length < 3) fail(`${where} is shorter than three letters.`);
    if (seen.has(entry.answer)) fail(`${entry.answer} is in the grid twice.`);
    seen.add(entry.answer);
    entry.clue = clue;
    for (const cell of entry.cells) cells[cell][entry.direction] = index;
  });

  // A clue for a word that is not in the grid is a mistake too.
  for (const direction of ['across', 'down'] as const) {
    for (const answer of Object.keys(puzzle[direction])) {
      if (!entries.some((entry) => entry.direction === direction && entry.answer === answer)) {
        fail(`there is a clue for ${answer} (${direction}), but no such word in the grid.`);
      }
    }
  }

  // Every white square should be part of a word both ways. Otherwise
  // a letter could only be got from one clue, which is thought unfair.
  cells.forEach((cell, index) => {
    if (cell.letter && (cell.across === null || cell.down === null)) {
      fail(`the square in row ${Math.floor(index / columns) + 1}, column ${(index % columns) + 1} is in only one word.`);
    }
  });

  return { columns, rows, cells, entries };
}

/** 134 seconds as "2:14". */
export function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
