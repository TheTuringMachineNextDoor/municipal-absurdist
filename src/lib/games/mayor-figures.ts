// The people who come to the Mayor's desk, drawn here as SVG.
//
// These are our own drawings, made from a small kit of parts: one head
// and coat, then a choice of hat, whiskers, eyewear and neckwear. A
// character is a combination of parts (see `characters` in
// src/data/the-mayor.ts), so a new one can be added without drawing
// anything. Colours come from the site's CSS variables: ink lines, with
// one yellow detail each.

export interface Traits {
  hat: 'top' | 'bowler' | 'peaked' | 'flat' | 'eyeshade' | 'boater' | 'bonnet' | 'none';
  whiskers: 'moustache' | 'walrus' | 'beard' | 'chops' | 'none';
  eyewear: 'spectacles' | 'monocle' | 'none';
  neckwear: 'bowtie' | 'tie' | 'collar' | 'brooch';
}

const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const ACCENT = 'var(--accent)';
// Shorthand for the usual outline.
const line = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;

const HATS: Record<Traits['hat'], string> = {
  top: `<rect x="42" y="6" width="36" height="32" fill="${INK}" ${line}/>
    <rect x="42" y="29" width="36" height="7" fill="${ACCENT}"/>
    <rect x="29" y="37" width="62" height="5" fill="${INK}" ${line}/>`,
  bowler: `<path d="M40 40 C38 12 82 12 80 40 Z" fill="${INK}" ${line}/>
    <rect x="40" y="33" width="40" height="5" fill="${ACCENT}"/>
    <rect x="31" y="39" width="58" height="4" fill="${INK}" ${line}/>`,
  peaked: `<path d="M36 34 C36 16 84 16 84 34 Z" fill="${INK}" ${line}/>
    <rect x="37" y="33" width="46" height="7" fill="${PAPER}" ${line}/>
    <path d="M35 41 H85 C80 50 40 50 35 41 Z" fill="${INK}" ${line}/>
    <path d="M60 19 L65 24 L60 31 L55 24 Z" fill="${ACCENT}" ${line}/>`,
  flat: `<path d="M35 42 C33 26 66 20 84 32 L92 42 Z" fill="${PAPER}" ${line}/>
    <path d="M44 35 C54 29 68 28 80 33 M40 39 H86" fill="none" ${line} stroke-width="1"/>
    <rect x="57" y="25" width="5" height="5" fill="${ACCENT}" ${line} stroke-width="1"/>`,
  eyeshade: `<path d="M40 44 C40 30 80 30 80 44" fill="none" ${line}/>
    <path d="M44 38 C47 30 52 33 55 36 M65 36 C68 33 73 30 76 38" fill="none" ${line} stroke-width="1"/>
    <path d="M36 43 H84 L94 53 H26 Z" fill="${ACCENT}" ${line}/>`,
  boater: `<rect x="43" y="22" width="34" height="16" fill="${PAPER}" ${line}/>
    <rect x="43" y="31" width="34" height="6" fill="${ACCENT}" ${line} stroke-width="1"/>
    <rect x="27" y="38" width="66" height="5" fill="${PAPER}" ${line}/>`,
  bonnet: `<path d="M38 60 C28 56 30 40 40 38 M82 60 C92 56 90 40 80 38" fill="${INK}" ${line}/>
    <path d="M42 36 C42 16 78 16 78 36 Z" fill="${PAPER}" ${line}/>
    <path d="M24 38 C36 30 84 30 96 38 C84 46 36 46 24 38 Z" fill="${PAPER}" ${line}/>
    <path d="M72 22 L78 28 L72 34 L66 28 Z" fill="${ACCENT}" ${line}/>
    <path d="M48 26 C52 22 58 21 62 22" fill="none" ${line} stroke-width="1"/>`,
  none: `<path d="M39 54 C36 40 44 34 50 36 M81 54 C84 40 76 34 70 36" fill="none" ${line}/>
    <path d="M38 52 l-4 3 M38 57 l-5 2 M82 52 l4 3 M82 57 l5 2" fill="none" ${line} stroke-width="1"/>`,
};

const WHISKERS: Record<Traits['whiskers'], string> = {
  moustache: `<path d="M46 76 C52 68 58 72 60 75 C62 72 68 68 74 76 C68 79 63 77 60 77 C57 77 52 79 46 76 Z" fill="${INK}"/>`,
  walrus: `<path d="M44 74 C50 68 57 70 60 73 C63 70 70 68 76 74 C78 84 70 88 66 80 C63 79 57 79 54 80 C50 88 42 84 44 74 Z" fill="${INK}"/>`,
  beard: `<path d="M39 68 C40 96 54 102 60 102 C66 102 80 96 81 68 C76 80 68 82 60 80 C52 82 44 80 39 68 Z" fill="${INK}"/>
    <path d="M52 86 H68" stroke="${PAPER}" stroke-width="1.5"/>`,
  chops: `<path d="M38 58 C36 74 40 84 50 84 C46 76 44 68 43 58 Z M82 58 C84 74 80 84 70 84 C74 76 76 68 77 58 Z" fill="${INK}"/>
    <path d="M54 81 Q60 84 66 81" fill="none" ${line}/>`,
  none: `<path d="M54 80 Q60 84 66 80" fill="none" ${line}/>`,
};

const EYEWEAR: Record<Traits['eyewear'], string> = {
  spectacles: `<rect x="45" y="55" width="12" height="10" fill="none" ${line} stroke-width="1.5"/>
    <rect x="63" y="55" width="12" height="10" fill="none" ${line} stroke-width="1.5"/>
    <path d="M57 59 H63 M45 59 L39 57 M75 59 L81 57" fill="none" ${line} stroke-width="1.5"/>`,
  monocle: `<circle cx="69" cy="60" r="7" fill="none" ${line} stroke-width="1.5"/>
    <path d="M76 62 C84 76 80 92 74 100" fill="none" stroke="${ACCENT}" stroke-width="1.5"/>`,
  none: '',
};

const NECKWEAR: Record<Traits['neckwear'], string> = {
  bowtie: `<path d="M60 104 L47 97 V111 Z M60 104 L73 97 V111 Z" fill="${ACCENT}" ${line}/>
    <rect x="57" y="101" width="6" height="6" fill="${INK}"/>`,
  tie: `<path d="M56 100 H64 L62 106 L66 126 L60 132 L54 126 L58 106 Z" fill="${ACCENT}" ${line}/>`,
  collar: `<path d="M50 97 L46 106 L58 104 Z M70 97 L74 106 L62 104 Z" fill="${PAPER}" ${line}/>
    <rect x="57" y="110" width="6" height="6" fill="${ACCENT}" ${line} stroke-width="1"/>`,
  brooch: `<path d="M48 98 C54 106 66 106 72 98" fill="none" ${line}/>
    <path d="M60 106 L66 113 L60 120 L54 113 Z" fill="${ACCENT}" ${line}/>`,
};

/** The SVG for one character, as text to put in the page. It is
    decorative: the card names the character in words beside it. */
export function drawFigure(traits: Traits): string {
  return `<svg viewBox="0 0 120 140" aria-hidden="true" focusable="false">
    <!-- the coat, with a few engraver's lines on the shoulders -->
    <path d="M12 140 C14 112 32 101 50 97 L60 112 L70 97 C88 101 106 112 108 140 Z" fill="${INK}" ${line}/>
    <path d="M24 122 L30 138 M32 114 L37 138 M96 122 L90 138 M88 114 L83 138" stroke="${PAPER}" stroke-width="1" fill="none"/>
    <!-- shirt front and neck -->
    <path d="M50 97 L60 132 L70 97 L66 88 H54 Z" fill="${PAPER}" ${line}/>
    <!-- ears, then the head over them -->
    <path d="M38 58 C32 56 32 70 39 70 M82 58 C88 56 88 70 81 70" fill="${PAPER}" ${line}/>
    <ellipse cx="60" cy="64" rx="22" ry="28" fill="${PAPER}" ${line}/>
    <!-- brows, eyes, nose -->
    <path d="M47 53 L56 54 M64 54 L73 53" fill="none" ${line}/>
    <rect x="50" y="58.5" width="3" height="3" fill="${INK}"/>
    <rect x="67" y="58.5" width="3" height="3" fill="${INK}"/>
    <path d="M60 60 L57 71 H62" fill="none" ${line} stroke-width="1.5"/>
    ${WHISKERS[traits.whiskers]}
    ${EYEWEAR[traits.eyewear]}
    ${HATS[traits.hat]}
    ${NECKWEAR[traits.neckwear]}
  </svg>`;
}
