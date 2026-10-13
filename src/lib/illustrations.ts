// One place to look up a picture's record: its size, its description
// (alt text), and the credit that must appear beside it.
//
// Pictures come from two places:
//   1. The library: files in public/illustrations with an entry in
//      credits.json, written by hand.
//   2. Uploads: pictures added through the editing desk, which saves
//      them under public/illustrations/uploads. Their description and
//      credit are typed into the same form as the article, product or
//      contributor they belong to, and their size is measured from the
//      file. They are gathered into the same kind of record below, so
//      the rest of the site cannot tell the two apart.
import fs from 'node:fs';
import { getCollection } from 'astro:content';
import credits from '../../public/illustrations/credits.json';
import { imageSize } from './image-size';

export interface IllustrationRecord {
  file: string;
  title: string;
  alt: string;
  credit: string;
  width: number;
  height: number;
  /** Optional. Where a cropped banner should centre, as a CSS position
      such as "50% 68%" (across, down). Set it in credits.json when the
      default crop cuts off the point of the picture. */
  focus?: string;
}

const records = credits as IllustrationRecord[];

/** Every file name recorded in credits.json. */
export const illustrationFiles = records.map((r) => r.file);

/** True for a picture added through the editing desk. */
export const isUpload = (file: string) => file.startsWith('uploads/');

const diskPath = (file: string) => `public/illustrations/${file}`;

/** A record for an uploaded picture, measured from the file itself. */
function measure(file: string, facts: { title: string; alt: string; credit: string }): IllustrationRecord {
  if (!fs.existsSync(diskPath(file))) {
    throw new Error(`The uploaded picture "${file}" is named in the content but is not in public/illustrations.`);
  }
  return { file, ...facts, ...imageSize(diskPath(file)) };
}

// Gather every uploaded picture named by an article, a product or a
// contributor, with the description and credit typed beside it. This
// runs once, when the site is built. (`await` at the top of a file
// makes everything that imports the file wait until it has finished.)
const uploads = new Map<string, IllustrationRecord>();
{
  const [articles, products, people] = await Promise.all([
    getCollection('articles'),
    getCollection('products'),
    getCollection('contributors'),
  ]);
  for (const { data } of articles) {
    if (isUpload(data.image)) {
      uploads.set(data.image, measure(data.image, { title: data.title, alt: data.imageAlt ?? '', credit: data.imageCredit ?? '' }));
    }
  }
  for (const { data } of products) {
    if (isUpload(data.image)) {
      uploads.set(data.image, measure(data.image, { title: data.title, alt: data.imageAlt ?? '', credit: data.imageCredit ?? '' }));
    }
  }
  for (const { data } of people) {
    if (data.portrait && isUpload(data.portrait)) {
      uploads.set(
        data.portrait,
        measure(data.portrait, { title: data.name, alt: `Portrait of ${data.name}`, credit: data.portraitCredit ?? '' }),
      );
    }
  }
}

/** The record for a file such as "great-wave.jpeg". Throws if the
    picture has no record, so an uncredited library picture can never be
    published. */
export function getIllustration(file: string): IllustrationRecord {
  const record = records.find((r) => r.file === file) ?? uploads.get(file);
  if (record) return record;

  // A picture dropped into the body of an article through the editing
  // desk. It has no form fields of its own: its description and credit
  // come from the picture's own "alt" and "title" in the text, which
  // src/lib/article-body.ts reads. Here we can only measure it.
  if (isUpload(file) && fs.existsSync(diskPath(file))) {
    return measure(file, { title: '', alt: '', credit: '' });
  }

  throw new Error(
    `"${file}" has no entry in public/illustrations/credits.json. ` +
      'Every illustration needs its source and credit recorded there before it is used.',
  );
}

/** Taller than it is wide. Upright pictures are set narrower. */
export const isPortrait = (record: IllustrationRecord) => record.height > record.width;

export const illustrationSrc = (file: string) => `/illustrations/${file}`;
