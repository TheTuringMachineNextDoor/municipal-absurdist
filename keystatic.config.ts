// Keystatic: the admin panel. This file describes the editing forms; the
// matching validation lives in src/content.config.ts.
//
// `storage: local` means the panel reads and writes the Markdown files
// in this folder directly. Nothing is published until you commit and
// push, exactly as if you had edited the files by hand.
import { collection, config, fields } from '@keystatic/core';
import { sections } from './src/data/sections';
import credits from './public/illustrations/credits.json';

// The picture menus list every image recorded in credits.json. To offer
// a new image here, add the file to public/illustrations and give it an
// entry in credits.json.
const illustrationOptions = credits.map((c) => ({ label: `${c.title} (${c.file})`, value: c.file }));

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'The Municipal Absurdist' },
  },
  collections: {
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'section', 'date'],
      schema: {
        title: fields.slug({
          name: { label: 'Headline', validation: { isRequired: true } },
          slug: {
            label: 'Address',
            description: 'The last part of the article’s web address. Do not change it after publication.',
          },
        }),
        dek: fields.text({
          label: 'Dek',
          description: 'The subheadline: one or two sentences beneath the headline.',
          multiline: true,
          validation: { isRequired: true },
        }),
        section: fields.select({
          label: 'Section',
          options: sections.map((s) => ({ label: s.name, value: s.slug })),
          defaultValue: sections[0].slug,
        }),
        author: fields.relationship({
          label: 'Author',
          collection: 'contributors',
          validation: { isRequired: true },
        }),
        illustrator: fields.relationship({
          label: 'Illustrator',
          description: 'Leave empty when the illustration comes from the archives.',
          collection: 'contributors',
        }),
        date: fields.date({
          label: 'Date of publication',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        image: fields.select({
          label: 'Lead illustration',
          options: illustrationOptions,
          defaultValue: illustrationOptions[0].value,
        }),
        imageAlt: fields.text({
          label: 'Description of the illustration',
          description: 'For readers who cannot see it. Leave blank to use the description on record.',
        }),
        imageCredit: fields.text({
          label: 'Illustration credit',
          description: 'Leave blank to use the credit on record in credits.json.',
        }),
        featured: fields.checkbox({ label: 'Featured', description: 'Eligible to lead the front page.' }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts appear on your own machine but are left out of the published paper.',
        }),
        sample: fields.checkbox({
          label: 'Sample',
          description: 'A placeholder article written to fill the page. Delete every sample before launch.',
        }),
        // Plain .md files, so they stay readable outside the panel.
        // Pull quote: use the quote button; a second paragraph inside
        // the quote is its attribution.
        // Inline illustration: type a line of its own in this form,
        //   ![Description of the picture](/illustrations/pantagruel-04.webp)
        // The panel shows that line as text; the site turns it into the
        // picture with its credit.
        body: fields.markdoc({
          label: 'Body',
          extension: 'md',
        }),
      },
    }),

    contributors: collection({
      label: 'Contributors',
      slugField: 'name',
      path: 'src/content/contributors/*',
      format: { contentField: 'bio' },
      columns: ['name', 'role'],
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        role: fields.select({
          label: 'Role',
          options: [
            { label: 'Writer', value: 'writer' },
            { label: 'Illustrator', value: 'illustrator' },
            { label: 'Both', value: 'both' },
          ],
          defaultValue: 'writer',
        }),
        portrait: fields.select({
          label: 'Portrait',
          options: [{ label: 'None', value: '' }, ...illustrationOptions],
          defaultValue: '',
        }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            url: fields.url({ label: 'Address', validation: { isRequired: true } }),
          }),
          { label: 'Links', itemLabel: (props) => props.fields.label.value },
        ),
        commissionsOpen: fields.checkbox({ label: 'Accepting commissions' }),
        tallyFormUrl: fields.url({ label: 'Tally form address' }),
        bio: fields.markdoc({ label: 'Biography', extension: 'md' }),
      },
    }),
  },
});
