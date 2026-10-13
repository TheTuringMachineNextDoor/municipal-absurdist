// One place to look up an illustration's record in credits.json: its
// size, its default alt text, and the credit that must appear beside it.
import credits from '../../public/illustrations/credits.json';

export interface IllustrationRecord {
  file: string;
  title: string;
  alt: string;
  credit: string;
  width: number;
  height: number;
}

const records = credits as IllustrationRecord[];

/** Every file name recorded in credits.json. */
export const illustrationFiles = records.map((r) => r.file);

/** The record for a file such as "great-wave.jpeg". Throws if the
    image has no entry, so an uncredited image can never be published. */
export function getIllustration(file: string): IllustrationRecord {
  const record = records.find((r) => r.file === file);
  if (!record) {
    throw new Error(
      `"${file}" has no entry in public/illustrations/credits.json. ` +
        'Every illustration needs its source and credit recorded there before it is used.',
    );
  }
  return record;
}

/** Taller than it is wide. Upright pictures are set narrower. */
export const isPortrait = (record: IllustrationRecord) => record.height > record.width;

export const illustrationSrc = (file: string) => `/illustrations/${file}`;
