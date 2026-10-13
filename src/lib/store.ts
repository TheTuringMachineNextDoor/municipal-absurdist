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

/** Every product with its artist looked up, in alphabetical order. */
export async function getProducts() {
  const products = (await getCollection('products')).sort((a, b) => a.data.title.localeCompare(b.data.title));
  return Promise.all(
    products.map(async (product) => {
      const artist = product.data.artist ? await getEntry(product.data.artist) : undefined;
      return {
        product,
        artist: artist && { name: artist.data.name, href: contributorPath(artist) },
      };
    }),
  );
}
