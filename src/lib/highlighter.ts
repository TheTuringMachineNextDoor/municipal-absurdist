// The highlighter stroke in a colour other than the house yellow.
//
// The .highlighter class (global.css) paints a marker stroke behind a
// headline as a small SVG picture. A picture used as a CSS background
// cannot read CSS variables, so its colour is written into it: yellow,
// in the stylesheet. To get another colour, the same picture is written
// out here with that colour in it and handed to the headline as an
// inline style, which takes the place of the yellow one.

/** Mix a colour with white. `strength` 1 is the colour itself, 0 is
    white. Colours are "#RRGGBB". */
export function tint(hex: string, strength: number): string {
  const channel = (start: number) => {
    const value = parseInt(hex.slice(start, start + 2), 16);
    return Math.round(value * strength + 255 * (1 - strength))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`.toUpperCase();
}

/** The colour a section's highlighter uses: its own colour, let down
    with white to about half strength. The section colours are deep (they
    were chosen as thin strokes in the navigation), and black type over a
    solid block of any of them would be hard to read; at half strength
    each still reads as its colour and the type stays clear. */
export const sectionHighlight = (sectionInk: string) => tint(sectionInk, 0.5);

/** The inline style that turns a .highlighter element this colour. */
export function highlighterStyle(hex: string): string {
  // Inside a web address "#" must be written "%23".
  const fill = hex.replace('#', '%23');
  const svg =
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E" +
    `%3Cpath fill='${fill}' d='M3 7 C22 3 41 8 63 5 S108 3 131 6 S176 4 198 3 L199 17 L196 26 L198 35 C171 38 148 34 121 37 S77 35 52 37 S19 35 2 38 L4 27 L1 19 Z'/%3E%3C/svg%3E`;
  return `background-image: url("data:image/svg+xml,${svg}")`;
}
