// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Keystatic (the admin panel at /keystatic) is only switched on while
// running `npm run dev`. It needs a live server to save files, and the
// published site is plain static HTML with no server at all. Leaving it
// out of `npm run build` keeps the deployed site static, with no admin
// page for strangers to find and no React shipped to readers.
const isDev = process.argv.includes('dev');

// The site's public address, needed to write full links in the page
// head, the sitemap and the feed. In order of preference:
//   1. SITE_URL, if you set it (do this once the paper has its own
//      domain: add SITE_URL=https://your-domain in Vercel's settings);
//   2. the address Vercel gives the project, which Vercel supplies
//      during its builds;
//   3. the local address, when building on your own machine.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,
  integrations: isDev ? [react(), keystatic()] : [],
  // The staff are listed on the About page. Anyone who goes looking for
  // /contributors is sent there. (Each person's own page is still at
  // /contributors/their-name.)
  redirects: {
    '/contributors': '/about#staff',
  },
});
