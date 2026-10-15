// The rules of Zoning, the falling-blocks game, with nothing about the
// screen in them: the well, the seven pieces, moving, turning, clearing
// full lines and scoring. The page (src/pages/games/zoning.astro) draws
// the well as text and handles keys and fingers.
//
// The well is 10 cells wide and 20 high, like the original of 1984.
// Two more rows sit hidden above the top, where a new piece appears
// before it falls into view.

export const COLS = 10;
export const ROWS = 20;
export const HIDDEN = 2;
const TOTAL = ROWS + HIDDEN;

/** One row per line of the well, top first; true where a block is. */
export type Well = boolean[][];

/** A piece's shape in a square box: true where it has a block. Turning
    the box turns the piece. */
export type Shape = boolean[][];

export interface Piece {
  shape: Shape;
  /** The box's top-left corner, in cells. */
  x: number;
  y: number;
}

// The seven pieces, each in a box just big enough to turn in.
const SHAPES: Shape[] = [
  ['....', '####', '....', '....'], // I
  ['##', '##'], // O
  ['.#.', '###', '...'], // T
  ['.##', '##.', '...'], // S
  ['##.', '.##', '...'], // Z
  ['#..', '###', '...'], // J
  ['..#', '###', '...'], // L
].map((rows) => rows.map((row) => [...row].map((c) => c === '#')));

export function emptyWell(): Well {
  return Array.from({ length: TOTAL }, () => Array<boolean>(COLS).fill(false));
}

/** A random piece's shape. Pure chance, as in the original, except that
    the same piece is not dealt twice running if a second draw avoids it
    (the rule of the 1989 home version, which makes long droughts rarer). */
export function randomShape(previous?: Shape): Shape {
  let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  if (shape === previous) shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return shape;
}

/** The shape turned a quarter: clockwise when dir is 1, anticlockwise
    when -1. */
export function turned(shape: Shape, dir: 1 | -1): Shape {
  const n = shape.length;
  return shape.map((_, r) =>
    shape.map((__, c) => (dir === 1 ? shape[n - 1 - c][r] : shape[c][n - 1 - r])),
  );
}

/** Every cell the piece covers, as [column, row]. */
export function cellsOf(piece: Piece): [number, number][] {
  const cells: [number, number][] = [];
  piece.shape.forEach((row, r) =>
    row.forEach((filled, c) => {
      if (filled) cells.push([piece.x + c, piece.y + r]);
    }),
  );
  return cells;
}

/** True if the piece is inside the well and on no block. */
export function fits(well: Well, piece: Piece): boolean {
  return cellsOf(piece).every(([x, y]) => x >= 0 && x < COLS && y >= 0 && y < TOTAL && !well[y][x]);
}

/** A new piece at the top of the well, centred, with its first row of
    blocks on the top visible line. */
export function placed(shape: Shape): Piece {
  const top = shape.findIndex((row) => row.some(Boolean));
  return { shape, x: Math.floor((COLS - shape.length) / 2), y: HIDDEN - top };
}

/** Turn the piece if there is room. Against a wall or another piece it
    may shuffle a cell or two sideways to make room (a "kick"), which
    the original did not do but every player since has expected.
    Returns the turned piece, or null if it cannot turn. */
export function turn(well: Well, piece: Piece, dir: 1 | -1): Piece | null {
  const shape = turned(piece.shape, dir);
  for (const kick of [0, -1, 1, -2, 2]) {
    const next = { shape, x: piece.x + kick, y: piece.y };
    if (fits(well, next)) return next;
  }
  return null;
}

/** Set the piece into the well. Returns false if any of it is above the
    top of the well, which ends the game. */
export function settle(well: Well, piece: Piece): boolean {
  let inside = true;
  for (const [x, y] of cellsOf(piece)) {
    well[y][x] = true;
    if (y < HIDDEN) inside = false;
  }
  return inside;
}

/** The rows that are full, top first. */
export function fullRows(well: Well): number[] {
  return well.flatMap((row, y) => (row.every(Boolean) ? [y] : []));
}

/** Take out the given rows; everything above drops down. */
export function clearRows(well: Well, rows: number[]): void {
  for (const y of [...rows].sort((a, b) => b - a)) well.splice(y, 1);
  while (well.length < TOTAL) well.unshift(Array<boolean>(COLS).fill(false));
}

/** The level: 1 to start, and one more for every ten lines cleared. */
export function levelFor(lines: number): number {
  return 1 + Math.floor(lines / 10);
}

/** Milliseconds between one fall of a cell and the next. Starts at 0.8
    seconds and gets about a sixth quicker each level, to a floor of
    1/16 of a second. */
export function fallTime(level: number): number {
  return Math.max(60, Math.round(800 * 0.83 ** (level - 1)));
}

/** Points for clearing 1, 2, 3 or 4 lines at once, times the level: the
    home version's table, where four at once is worth far more than four
    one at a time. */
export function pointsFor(cleared: number, level: number): number {
  return [0, 40, 100, 300, 1200][cleared] * level;
}
