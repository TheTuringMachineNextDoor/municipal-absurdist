// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// Keystatic is the editing desk at /keystatic.
//
// On your own machine (`npm run dev`) it reads and writes the files in
// this folder directly. On the live site it signs you in with GitHub
// and saves each change as a commit, which Vercel then publishes. That
// needs a small piece of server code to talk to GitHub, and the Vercel
// adapter below is what lets a few addresses (/keystatic and
// /api/keystatic) run as server code. Every other page is still built
// once as plain HTML, exactly as before.

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
  adapter: vercel(),
  // React is used by the editing desk only; no other page loads it.
  integrations: [react(), keystatic()],
  // The staff are listed on the About page. Anyone who goes looking for
  // /contributors is sent there. (Each person's own page is still at
  // /contributors/their-name.)
  redirects: {
    '/contributors': '/about#staff',
  },
});
