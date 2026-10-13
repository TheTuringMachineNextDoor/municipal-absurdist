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
import { illustrationFiles } from './lib/illustrations';

// z.enum wants a non-empty list of literal strings, so the slugs are
// pulled out of sections.ts here. A section is still only named once.
const sectionSlugs = sections.map((s) => s.slug) as [
  (typeof sections)[number]['slug'],
  ...(typeof sections)[number]['slug'][],
];

// The admin panel saves an untouched optional field as an empty string
// or null. Both mean "not provided".
const blankToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);

// An image is named by its file in public/illustrations, and must
// already have a credit on record.
const illustration = z.string().refine((file) => illustrationFiles.includes(file), {
  message: 'This image has no entry in public/illustrations/credits.json.',
});

const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    section: z.enum(sectionSlugs),
    author: reference('contributors'),
    illustrator: z.preprocess(blankToUndefined, reference('contributors').optional()),
    date: z.coerce.date(),
    image: illustration,
    // Alt text describes the picture for readers who cannot see it. If
    // left blank, the description in credits.json is used.
    imageAlt: z.preprocess(blankToUndefined, z.string().optional()),
    // Leave blank to use the credit in credits.json.
    imageCredit: z.preprocess(blankToUndefined, z.string().optional()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Marks placeholder articles written to fill the page during
    // development. Search for "sample: true" to find and delete them
    // all before launch.
    sample: z.boolean().default(false),
  }),
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
    portrait: z.preprocess(blankToUndefined, illustration.optional()),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    commissionsOpen: z.boolean().default(false),
    tallyFormUrl: z.preprocess(blankToUndefined, z.string().url().optional()),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  // The description is the body of the Markdown file.
  schema: z.object({
    title: z.string(),
    // Which shelf of the Store it sits on.
    kind: z.enum(['print', 'merchandise']),
    // Leave empty for work from the archives or made by the paper itself.
    artist: z.preprocess(blankToUndefined, reference('contributors').optional()),
    image: illustration,
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
  }),
});

export const collections = { articles, contributors, products };
