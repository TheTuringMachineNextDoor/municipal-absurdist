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
// The `quote` is used in questions that match a writer to their words.

export interface Author {
  /** Also the portrait's file name: authors/<id>.webp */
  id: string;
  name: string;
  lived: string;
  line: string;
  /** Something the writer actually wrote, word for word. Check it
      against the book before adding one: misquotations are everywhere. */
  quote: string;
  /** Where the quote is from; shown after the reader answers. */
  quoteFrom: string;
}

export const authors: Author[] = [
  { id: "mark-twain", name: "Mark Twain", lived: "1835–1910", line: "Humorist. Described reports of his death as exaggerated, and was in time proved wrong.", quote: "Truth is the most valuable thing we have. Let us economize it.", quoteFrom: "Following the Equator (1897)" },
  { id: "charles-dickens", name: "Charles Dickens", lived: "1812–1870", line: "Was paid by the instalment, and wrote accordingly.", quote: "It was the best of times, it was the worst of times.", quoteFrom: "A Tale of Two Cities (1859)" },
  { id: "jane-austen", name: "Jane Austen", lived: "1775–1817", line: "Six novels, each closely concerned with who has how many pounds a year.", quote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", quoteFrom: "Pride and Prejudice (1813)" },
  { id: "edgar-allan-poe", name: "Edgar Allan Poe", lived: "1809–1849", line: "Invented the detective story and was found insensible in a Baltimore street, in that order.", quote: "Quoth the Raven “Nevermore.”", quoteFrom: "The Raven (1845)" },
  { id: "oscar-wilde", name: "Oscar Wilde", lived: "1854–1900", line: "Is said to have declared nothing at customs but his genius. Customs let it through.", quote: "I can resist everything except temptation.", quoteFrom: "Lady Windermere’s Fan (1892)" },
  { id: "leo-tolstoy", name: "Leo Tolstoy", lived: "1828–1910", line: "Wrote at very great length on the virtues of a simple life.", quote: "Happy families are all alike; every unhappy family is unhappy in its own way.", quoteFrom: "Anna Karenina (1878), tr. Constance Garnett" },
  { id: "emily-dickinson", name: "Emily Dickinson", lived: "1830–1886", line: "Saw about ten poems into print in her lifetime and left nearly eighteen hundred in a drawer.", quote: "Because I could not stop for Death – He kindly stopped for me –", quoteFrom: "Poem 479, written c. 1863" },
  { id: "walt-whitman", name: "Walt Whitman", lived: "1819–1892", line: "Reviewed his own book, anonymously and with great enthusiasm.", quote: "I am large, I contain multitudes.", quoteFrom: "Song of Myself (1855)" },
  { id: "mary-shelley", name: "Mary Shelley", lived: "1797–1851", line: "Began Frankenstein at eighteen, on a wet holiday, as her entry in a ghost-story contest. She won.", quote: "Beware; for I am fearless, and therefore powerful.", quoteFrom: "Frankenstein (1818)" },
  { id: "fyodor-dostoevsky", name: "Fyodor Dostoevsky", lived: "1821–1881", line: "Was led out to be shot, reprieved at the last moment, and wrote long novels in which this comes up.", quote: "I am a sick man.... I am a spiteful man. I am an unattractive man.", quoteFrom: "Notes from Underground (1864), tr. Constance Garnett" },
  { id: "victor-hugo", name: "Victor Hugo", lived: "1802–1885", line: "Is said to have asked how Les Misérables was selling by telegram: “?” The reply was “!”", quote: "To love or to have loved, that is enough. Ask nothing further.", quoteFrom: "Les Misérables (1862), tr. Charles Wilbour" },
  { id: "herman-melville", name: "Herman Melville", lived: "1819–1891", line: "Wrote a very long book about a whale. It sold poorly, and he became a customs inspector.", quote: "Call me Ishmael.", quoteFrom: "Moby-Dick (1851)" },
  { id: "jonathan-swift", name: "Jonathan Swift", lived: "1667–1745", line: "Proposed, modestly, that the poor sell their children as food. Not every reader took it as satire.", quote: "Satire is a sort of glass, wherein beholders do generally discover everybody’s face but their own.", quoteFrom: "The Battle of the Books (1704)" },
  { id: "voltaire", name: "Voltaire", lived: "1694–1778", line: "Was sent to the Bastille for his wit and carried on regardless.", quote: "We must cultivate our garden.", quoteFrom: "Candide (1759)" },
  { id: "ambrose-bierce", name: "Ambrose Bierce", lived: "1842–c. 1914", line: "Wrote The Devil’s Dictionary, rode into Mexico at seventy-one, and has not filed since.", quote: "Bore, n. A person who talks when you wish him to listen.", quoteFrom: "The Devil’s Dictionary (1911)" },
  { id: "charlotte-bronte", name: "Charlotte Brontë", lived: "1816–1855", line: "Published Jane Eyre as “Currer Bell,” reviewers having views about lady novelists.", quote: "Reader, I married him.", quoteFrom: "Jane Eyre (1847)" },
  { id: "nikolai-gogol", name: "Nikolai Gogol", lived: "1809–1852", line: "Wrote a story in which a nose leaves its owner and is found to outrank him.", quote: "What are you laughing at? You are laughing at yourselves!", quoteFrom: "The Inspector General (1836)" },
  { id: "honore-de-balzac", name: "Honoré de Balzac", lived: "1799–1850", line: "Wrote some ninety novels on what is put, by legend, at fifty cups of coffee a day.", quote: "The secret of great fortunes without apparent cause is a crime forgotten, for it was properly done.", quoteFrom: "Father Goriot (1835), tr. Ellen Marriage" },
  { id: "lewis-carroll", name: "Lewis Carroll", lived: "1832–1898", line: "A lecturer in mathematics. The photograph is his own work, as was the rabbit hole.", quote: "Curiouser and curiouser!", quoteFrom: "Alice’s Adventures in Wonderland (1865)" },
  { id: "anton-chekhov", name: "Anton Chekhov", lived: "1860–1904", line: "A doctor who wrote plays in which very little happens, to lasting acclaim.", quote: "Medicine is my lawful wife and literature is my mistress.", quoteFrom: "Letter to A.S. Suvorin, 11 September 1888" },
];

/** Portraits in a round. */
export const ROUND_LENGTH = 8;
/** Answers offered for each question, the right one included. */
export const CHOICES = 4;
