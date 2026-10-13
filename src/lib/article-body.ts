// Turns the HTML that Markdown produces into the paper's article body.
//
// In Markdown an inline illustration is written as an ordinary image on
// a line of its own:
//
//   ![A lone polar bear on sea ice.](/illustrations/polar-bear.jpeg)
//
// Markdown renders that as <p><img ...></p>. This swaps each one for a
// <figure> with the image's size (so the page does not jump as it loads)
// and its credit from credits.json. Writers never type a credit, and an
// image without one stops the build.
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

    return (
      `<figure class="illustration illustration--inline${isPortrait(record) ? ' illustration--portrait' : ''}">` +
      `<img src="${src}" alt="${alt}" width="${record.width}" height="${record.height}" loading="lazy" decoding="async">` +
      `<figcaption>${escapeHtml(record.credit)}</figcaption>` +
      '</figure>'
    );
  });
}
