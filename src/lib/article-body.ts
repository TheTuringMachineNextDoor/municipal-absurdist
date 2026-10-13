// Turns the HTML that Markdown produces into the paper's article body.
//
// In Markdown an inline illustration is written as an ordinary image on
// a line of its own:
//
//   ![A lone polar bear on sea ice.](/illustrations/polar-bear.jpeg)
//
// Markdown renders that as <p><img ...></p>. This swaps each one for a
// <figure> with the image's size (so the page does not jump as it loads)
// and its credit. For a picture from the library the credit comes from
// credits.json and is never typed. For a picture uploaded into the text
// through the editing desk, the credit is the image's title.
//
// Pull quotes need no help: a Markdown blockquote (a line starting with
// ">") is styled as a pull quote by ArticleBody.astro.
import { getIllustration, isPortrait } from './illustrations';

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const LONE_IMAGE = /<p>\s*(<img\b[^>]*>)\s*<\/p>/g;
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

export function renderArticleBody(html: string): string {
  return html.replace(LONE_IMAGE, (whole, img: string) => {
    const src = attribute(img, 'src');
    if (!src?.startsWith('/illustrations/')) return whole;

    const record = getIllustration(decodeURIComponent(src.replace('/illustrations/', '')));
    // The alt text arrives already escaped by the Markdown renderer.
    const alt = attribute(img, 'alt') || escapeHtml(record.alt);
    // A library picture's credit is on record. A picture uploaded into
    // the text carries its credit as the image's "title". If the editor
    // left that out, say so on the page instead of printing nothing:
    // a visible gap gets fixed, a silent one does not.
    const credit = record.credit
      ? escapeHtml(record.credit)
      : attribute(img, 'title') || 'Credit to be supplied.';

    return (
      `<figure class="illustration illustration--inline${isPortrait(record) ? ' illustration--portrait' : ''}">` +
      `<img src="${src}" alt="${alt}" width="${record.width}" height="${record.height}" loading="lazy" decoding="async">` +
      `<figcaption>${credit}</figcaption>` +
      '</figure>'
    );
  });
}
