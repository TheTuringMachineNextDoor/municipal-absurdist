// Helpers shared by the Store pages.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { contributorPath } from './contributors';

export type Product = CollectionEntry<'products'>;

export const productPath = (product: { id: string }) => `/store/${product.id}`;

/** 35 as "$35". Prices are kept in whole dollars. */
export const formatPrice = (dollars: number) => `$${dollars}`;

/** Whether a product can be bought, and if not, what to say instead.
    Buying happens on Stripe: each product has its own Payment Link, and
    the site only links to it. There is no cart and no card details ever
    touch this site. */
export function saleState(product: Product) {
  const { available, stripeLink } = product.data;
  if (!available) return { canBuy: false as const, notice: 'Sold Out' };
  if (!stripeLink) return { canBuy: false as const, notice: 'Not Yet on Sale' };
  return { canBuy: true as const, link: stripeLink };
}

/** Who to name on a product with no artist: an old print is from the
    archives; goods are the paper's own. */
export const makerOf = (product: Product) =>
  product.data.kind === 'print' ? 'From the Archives' : 'By The Municipal Absurdist';

/** The shelves of the Merch Shop, in the order they are shown. `blurb`
    is the line on the shelf's card on the Store's front page. */
export const MERCH = [
  { id: 'pin', name: 'Pins', blurb: 'Enamel, for the lapel. Identifies the wearer to anyone standing unreasonably close.' },
  { id: 't-shirt', name: 'T-Shirts', blurb: 'The hat, worn on the chest. Not a uniform, though the paper has no other.' },
  { id: 'tote', name: 'Totes', blurb: 'Stout canvas. Holds a week of newspapers, or what they used to buy.' },
  { id: 'notebook', name: 'Notebooks', blurb: 'Ruled pages for the recording of facts, should any present themselves.' },
  { id: 'mug', name: 'Mugs', blurb: 'Ceramic. Holds roughly one deadline of coffee.' },
] as const;

/** "From $35": the lowest price among some products, for a shelf's card. */
export const fromPrice = (products: { product: Product }[]) =>
  products.length > 0 ? `From ${formatPrice(Math.min(...products.map((p) => p.product.data.price)))}` : 'Expected shortly';

/** Every product with its artist looked up, in alphabetical order. */
export async function getProducts() {
  const products = (await getCollection('products')).sort((a, b) => a.data.title.localeCompare(b.data.title));
  return Promise.all(
    products.map(async (product) => {
      const artist = product.data.artist ? await getEntry(product.data.artist) : undefined;
      return {
        product,
        artist: artist && { id: artist.id, name: artist.data.name, href: contributorPath(artist) },
      };
    }),
  );
}
