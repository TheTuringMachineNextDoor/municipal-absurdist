// Authors & Faces: the writers in the game.
//
// Every writer here died long ago, and every portrait is in the public
// domain (checked on Wikimedia Commons; the details are in
// public/illustrations/credits.json under "authors/<id>.webp").
//
// TO ADD A WRITER: put a 480 by 600 portrait at
// public/illustrations/authors/<id>.webp, give it an entry in
// credits.json, and add a line here. Use only portraits that are in the
// public domain: as a rule, made before about 1900 by someone long dead.
//
// The `line` is shown after the reader answers. House voice; keep it true.

export interface Author {
  /** Also the portrait's file name: authors/<id>.webp */
  id: string;
  name: string;
  lived: string;
  line: string;
}

export const authors: Author[] = [
  { id: "mark-twain", name: "Mark Twain", lived: "1835–1910", line: "Humorist. Described reports of his death as exaggerated, and was in time proved wrong." },
  { id: "charles-dickens", name: "Charles Dickens", lived: "1812–1870", line: "Was paid by the instalment, and wrote accordingly." },
  { id: "jane-austen", name: "Jane Austen", lived: "1775–1817", line: "Six novels, each closely concerned with who has how many pounds a year." },
  { id: "edgar-allan-poe", name: "Edgar Allan Poe", lived: "1809–1849", line: "Invented the detective story and was found insensible in a Baltimore street, in that order." },
  { id: "oscar-wilde", name: "Oscar Wilde", lived: "1854–1900", line: "Is said to have declared nothing at customs but his genius. Customs let it through." },
  { id: "leo-tolstoy", name: "Leo Tolstoy", lived: "1828–1910", line: "Wrote at very great length on the virtues of a simple life." },
  { id: "emily-dickinson", name: "Emily Dickinson", lived: "1830–1886", line: "Saw about ten poems into print in her lifetime and left nearly eighteen hundred in a drawer." },
  { id: "walt-whitman", name: "Walt Whitman", lived: "1819–1892", line: "Reviewed his own book, anonymously and with great enthusiasm." },
  { id: "mary-shelley", name: "Mary Shelley", lived: "1797–1851", line: "Began Frankenstein at eighteen, on a wet holiday, as her entry in a ghost-story contest. She won." },
  { id: "fyodor-dostoevsky", name: "Fyodor Dostoevsky", lived: "1821–1881", line: "Was led out to be shot, reprieved at the last moment, and wrote long novels in which this comes up." },
  { id: "victor-hugo", name: "Victor Hugo", lived: "1802–1885", line: "Is said to have asked how Les Misérables was selling by telegram: “?” The reply was “!”" },
  { id: "herman-melville", name: "Herman Melville", lived: "1819–1891", line: "Wrote a very long book about a whale. It sold poorly, and he became a customs inspector." },
  { id: "jonathan-swift", name: "Jonathan Swift", lived: "1667–1745", line: "Proposed, modestly, that the poor sell their children as food. Not every reader took it as satire." },
  { id: "voltaire", name: "Voltaire", lived: "1694–1778", line: "Was sent to the Bastille for his wit and carried on regardless." },
  { id: "ambrose-bierce", name: "Ambrose Bierce", lived: "1842–c. 1914", line: "Wrote The Devil’s Dictionary, rode into Mexico at seventy-one, and has not filed since." },
  { id: "charlotte-bronte", name: "Charlotte Brontë", lived: "1816–1855", line: "Published Jane Eyre as “Currer Bell,” reviewers having views about lady novelists." },
  { id: "nikolai-gogol", name: "Nikolai Gogol", lived: "1809–1852", line: "Wrote a story in which a nose leaves its owner and is found to outrank him." },
  { id: "honore-de-balzac", name: "Honoré de Balzac", lived: "1799–1850", line: "Wrote some ninety novels on what is put, by legend, at fifty cups of coffee a day." },
  { id: "lewis-carroll", name: "Lewis Carroll", lived: "1832–1898", line: "A lecturer in mathematics. The photograph is his own work, as was the rabbit hole." },
  { id: "anton-chekhov", name: "Anton Chekhov", lived: "1860–1904", line: "A doctor who wrote plays in which very little happens, to lasting acclaim." },
];

/** Portraits in a round. */
export const ROUND_LENGTH = 8;
/** Names offered for each portrait, the right one included. */
export const CHOICES = 4;
