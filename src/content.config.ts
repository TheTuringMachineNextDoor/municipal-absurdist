// Content collections: the shape every article and contributor file must
// have. Astro checks each Markdown file's front matter against these
// schemas at build time and stops the build, with a readable message, if
// a field is missing or wrong.
//
// The same fields are described a second time in keystatic.config.ts,
// which draws the editing form. If you add a field, add it in both.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { sections } from './data/sections';
import credits from '../public/illustrations/credits.json';

// z.enum wants a non-empty list of literal strings, so the slugs are
// pulled out of sections.ts here. A section is still only named once.
const sectionSlugs = sections.map((s) => s.slug) as [
  (typeof sections)[number]['slug'],
  ...(typeof sections)[number]['slug'][],
];

// The admin panel saves an untouched optional field as an empty string
// or null. Both mean "not provided".
const blankToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);

// ---- Pictures ----
// A picture comes from one of two places:
//   - the library: a file in public/illustrations with an entry in
//     credits.json, chosen from a menu in the editing form; or
//   - an upload: a file added through the editing form, which the form
//     saves under public/illustrations/uploads and records as an address
//     like /illustrations/uploads/articles/my-article/upload.jpg.
// Whichever was used ends up in one field (`image`, or `portrait`) as a
// path under /illustrations, so the rest of the site has one thing to
// look at. An upload wins if both are given.
const illustrationFiles = credits.map((c) => c.file);
const optionalText = z.preprocess(blankToUndefined, z.string().optional());
const fromUpload = (address: string) => address.replace(/^\/illustrations\//, '');

/** Checks shared by anything with a picture, a description and a credit. */
function checkPicture(
  data: { image?: string; upload?: string; imageAlt?: string; imageCredit?: string },
  ctx: z.RefinementCtx,
  required: boolean,
) {
  if (data.upload) {
    // The paper's rule: no picture is printed without a description
    // (for readers who cannot see it) and a credit.
    if (!data.imageAlt) ctx.addIssue({ code: 'custom', path: ['imageAlt'], message: 'An uploaded picture needs a description.' });
    if (!data.imageCredit) ctx.addIssue({ code: 'custom', path: ['imageCredit'], message: 'An uploaded picture needs a credit.' });
  } else if (data.image) {
    if (!illustrationFiles.includes(data.image)) {
      ctx.addIssue({ code: 'custom', path: ['image'], message: 'This image has no entry in public/illustrations/credits.json.' });
    }
  } else if (required) {
    ctx.addIssue({ code: 'custom', path: ['image'], message: 'Choose a picture from the library or upload one.' });
  }
}

const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    section: z.enum(sectionSlugs),
    author: reference('contributors'),
    illustrator: z.preprocess(blankToUndefined, reference('contributors').optional()),
    date: z.coerce.date(),
    // A picture from the library...
    image: optionalText,
    // ...or one uploaded for this article.
    upload: optionalText,
    // Alt text describes the picture for readers who cannot see it. For
    // a library picture, blank means "use the description on record".
    // For an upload it is required.
    imageAlt: optionalText,
    // Likewise the credit.
    imageCredit: optionalText,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Marks placeholder articles written to fill the page during
    // development. Search for "sample: true" to find and delete them
    // all before launch.
    sample: z.boolean().default(false),
  })
    .superRefine((data, ctx) => checkPicture(data, ctx, true))
    // After checking, settle on the one picture. `transform` changes
    // what the rest of the site receives: `image` is always filled in.
    .transform((data) => ({ ...data, image: data.upload ? fromUpload(data.upload) : data.image! })),
});

const contributors = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/contributors' }),
  // The bio is the body of the Markdown file, below the front matter.
  schema: z.object({
    name: z.string(),
    role: z.enum(['writer', 'illustrator', 'both']),
    // Where they are listed on the About page: among the main staff, or
    // among the occasional contributors beneath. "auto" decides by how
    // much they have published (see src/lib/contributors.ts).
    standing: z.preprocess(blankToUndefined, z.enum(['auto', 'main', 'occasional']).default('auto')),
    portrait: optionalText,
    // An uploaded portrait, with who took or drew it.
    portraitUpload: optionalText,
    portraitCredit: optionalText,
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    commissionsOpen: z.boolean().default(false),
    tallyFormUrl: z.preprocess(blankToUndefined, z.string().url().optional()),
  })
    .superRefine((data, ctx) => {
      if (data.portraitUpload && !data.portraitCredit) {
        ctx.addIssue({ code: 'custom', path: ['portraitCredit'], message: 'An uploaded portrait needs a credit.' });
      }
      if (!data.portraitUpload && data.portrait && !illustrationFiles.includes(data.portrait)) {
        ctx.addIssue({ code: 'custom', path: ['portrait'], message: 'This image has no entry in public/illustrations/credits.json.' });
      }
    })
    .transform((data) => ({ ...data, portrait: data.portraitUpload ? fromUpload(data.portraitUpload) : data.portrait })),
});

const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  // The description is the body of the Markdown file.
  schema: z.object({
    title: z.string(),
    // Which shelf of the Store it sits on.
    kind: z.enum(['print', 'merchandise']),
    // For merchandise: which shelf of the Merch Shop. Ignored for prints.
    category: z.preprocess(blankToUndefined, z.enum(['pin', 't-shirt', 'tote', 'notebook', 'mug']).optional()),
    // Leave empty for work from the archives or made by the paper itself.
    artist: z.preprocess(blankToUndefined, reference('contributors').optional()),
    image: optionalText,
    upload: optionalText,
    imageAlt: optionalText,
    imageCredit: optionalText,
    // In whole dollars.
    price: z.number().nonnegative(),
    // The Stripe Payment Link that sells it. While this is blank the
    // product is shown but cannot be bought ("Not yet on sale").
    stripeLink: z.preprocess(blankToUndefined, z.string().url().optional()),
    // e.g. "Edition of 50" or "A3, giclée on cotton paper".
    edition: z.preprocess(blankToUndefined, z.string().optional()),
    // Untick when it has sold out.
    available: z.boolean().default(true),
    sample: z.boolean().default(false),
  })
    .superRefine((data, ctx) => checkPicture(data, ctx, true))
    .transform((data) => ({ ...data, image: data.upload ? fromUpload(data.upload) : data.image! })),
});

export const collections = { articles, contributors, products };
