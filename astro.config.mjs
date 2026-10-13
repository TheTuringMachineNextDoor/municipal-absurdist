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

// https://astro.build/config
export default defineConfig({
  integrations: isDev ? [react(), keystatic()] : [],
  // The staff are listed on the About page. Anyone who goes looking for
  // /contributors is sent there. (Each person's own page is still at
  // /contributors/their-name.)
  redirects: {
    '/contributors': '/about#staff',
  },
});
