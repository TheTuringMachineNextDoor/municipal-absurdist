# The Municipal Absurdist

*The public is advised to remain calm.*

An independent digital satire publication with the seriousness of a newspaper and the humor the world deserves. A home for young writers, illustrators, cartoonists, and artists to be published, seen, and paid.

**Guiding principle:** A real newspaper for an absurd world. Take the craft seriously; never take ourselves seriously.

The full brief lives in `docs/brief.md`. Read it before any major feature work.

---

## Voice

- Deadpan. Write like a 1908 broadsheet reporting on 2026. The design and copy never wink.
- All UI text is in house voice: buttons, empty states, 404s, form labels, error messages. ("This page has been misplaced by the Department of Pages.")
- Never use lorem ipsum. Placeholder content means plausible satirical headlines and deks in house voice.
- Satire is targeted: every piece knows who it's aiming at.

---

## Stack

- **Astro**: framework, static-first. Use content collections for articles, artists, and products.
- **Keystatic**: git-based CMS for editing content, at `/keystatic`. On your own machine (`npm run dev`, `http://127.0.0.1:4321/keystatic`) it edits the files directly. On the live site it signs in with GitHub and saves each change as a commit, which Vercel publishes; only GitHub accounts with write access to the repo get in. That needs `@astrojs/vercel` (so `/keystatic` and `/api/keystatic` can run as server code; every other page is still static) and four environment variables in Vercel (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`). First-time setup: `PUBLIC_KEYSTATIC_FORCE_GITHUB=true npm run dev`, then follow the panel. It needs React (`@astrojs/react`, `react`, `react-dom`), used by the panel only.
- **TypeScript**, plain CSS with custom properties. **No Tailwind, no UI kits.**
- **Hosting**: Vercel (auto-deploy from `main`).
- **Newsletter**: Buttondown embed form.
- **Payments**: Stripe Payment Links (prints, donations). No cart.
- **Commissions**: Tally form embedded on artist pages.
- **Supabase** (`@supabase/supabase-js`): reader accounts, likes, saved articles, comments. Used from the browser only; the site stays static.

Ask before adding any dependency not listed here.

---

## Content model

**Articles** (`src/content/articles/*.md`)
- `title`, `dek` (subheadline), `section`, `author` (ref), `illustrator` (ref, optional), `date`, `image`, `imageAlt` (optional), `imageCredit` (optional), `featured` (bool), `draft` (bool), `sample` (bool; placeholder articles to delete before launch)
- `image` is a file name from `public/illustrations/` that has an entry in `credits.json`. `imageAlt` and `imageCredit` fall back to that entry when blank.
- In the body, a `>` blockquote is a pull quote (a second paragraph inside it is the attribution), and `![description](/illustrations/file.webp)` on its own line is an inline illustration with its credit added automatically.
- Schemas live in `src/content.config.ts` (validation) and `keystatic.config.ts` (the editing form). Change both together.

**Sections:** `politics`, `culture`, `education`, `money`, `comic`, `games`

**Contributors** (`src/content/contributors/*.md`)
- `name`, `role` (writer / illustrator / both), `standing` (auto / main / occasional: where they are listed on `/about`), `bio` (the Markdown body), `portrait`, `links`, `commissionsOpen` (bool), `tallyFormUrl`

**Products** (`src/content/products/*.md`)
- `title`, `kind` (print / merchandise), `artist` (ref, optional), `image`, `price` (whole dollars), `stripeLink`, `edition` (e.g. "1 of 50"), `available` (bool), `sample` (bool); the description is the Markdown body

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage: full masthead, lead story (2/3) beside latest headlines (1/3), a band per section, comic slot, recurring features (`src/data/features.ts`), newsletter box (`newsletterAction` in `src/data/site.ts`). The full masthead (hat, name, slogan) is the same on every page. |
| `/[section]` and `/[section]/page/[n]` | Section front (`SectionFront.astro`): the section's lead story beside headlines from the rest of the paper, then cards with dates, then older pages (12 cards a page). The Comic front shows strips large in frames instead. |
| `/[section]/[slug]` | Article |
| `/contributors/[slug]` | A page for each contributor: bio, links, commission form (their own Tally form, shown when `commissionsOpen`), portfolio of pictures they drew, and articles they wrote. Helpers in `src/lib/contributors.ts`. Bylines on articles link here. There is no list page: the staff are listed on `/about`, and `/contributors` redirects there. |
| `/store` and `/store/[slug]` | The Store: Art & Prints, Merchandise, and Commissions (contributors with `commissionsOpen`, linking to the form on their page). Each product has its own page with a Purchase button to its Stripe Payment Link; with no link it shows "Not Yet on Sale", and with `available: false`, "Sold Out". Helpers in `src/lib/store.ts`. |
| `/submit` | Write for Us / Draw for Us / Create for Us: what each desk wants, how work is credited, and a button to each desk's Tally form (`submissionForms` in `src/data/site.ts`) |
| `/about` | What the paper is, what it stands for, why it is different and why it matters; then the staff: main writers and main artists with portraits, then occasional writers and artists as smaller lists. A contributor's `standing` (auto / main / occasional) decides which; auto means main after `MAIN_AFTER` pieces. |
| `/support` | Donations by Stripe Payment Link (`donationLinks` in `src/data/site.ts`), plus other ways to help |
| `/newsletter` | The newsletter's own page, with the signup box |
| `/games` and `/games/[game]` | Games hub (list in `src/data/games.ts`) and each game. Games share `GameLayout`, `ResultsCard` and the helpers in `src/lib/games/` (daily puzzle in America/Chicago time, stats in localStorage, share text). |
| `/games/crossword/submit` | How to send in a crossword, with the Tally form (`crosswordSubmissionForm` in `src/data/site.ts`). Puzzles live in `src/data/crosswords.ts`; the build checks each one. |
| `/games/caption-contest` | Caption contest. Contests and results in `src/data/caption-contests.ts` (the last entry is the open one); entries via Tally (`captionContestForm` in `src/data/site.ts`). `TallyForm.astro` embeds any Tally form. |
| `/archive`, `/contact` | Every article by month; a Tally contact form (`contactForm` in `src/data/site.ts`) |
| `/login`, `/signup`, `/account` | Reader accounts (Supabase). Sign-in is by emailed link, no passwords. `/account` shows the reader's name, saved and liked articles and their letters; an administrator also gets the Letters Desk for moderating. All of it is switched off, with holding notices, until `supabase` in `src/data/site.ts` is filled in. The database tables and access rules are in `supabase/schema.sql`, which also lists the setup steps. Browser-side helpers are in `src/lib/accounts.ts`. |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | The feed, the list of pages for search engines, and the note to their crawlers. Written by hand in `src/pages/` (no plugin). The site's address comes from `SITE_URL` or Vercel; see `astro.config.mjs`. |
| `/styleguide` | Living reference of every design element (dev only) |

---

## Design system

**The look:** an old newspaper crossed with an illustrated literary journal (*The Public Domain Review*). Authentic, collected, slightly eccentric, but clean, readable, and modern in usability.

**Masthead:** "The Municipal Absurdist" on one line in `Nova Cut`, with a small top hat centred above it. Beneath it the slogan in grey italic: *The world, as it unfortunately is*. Dateline bar below between thin rules.

**Small mark (for now):** the masthead's top hat as a solid silhouette with a yellow band (`public/favicon.svg`). The eventual mark: a side profile of a formally dressed, pipe-smoking gentleman seated on a Victorian high-tank toilet, using a laptop, drawn straight-faced in engraved line style. Needs a detailed version and a simplified silhouette for favicon and avatar sizes. Use a placeholder SVG until the artist delivers.

**Type** (Google Fonts):
- Nameplate (masthead and footer): `Nova Cut`
- Blackletter drop cap: `UnifrakturMaguntia`
- Headlines: `Alegreya` (medium, 500)
- Body: `Alegreya`
- Labels, section names, bylines, datelines: `Alegreya SC` (small caps)

**Color tokens** (`src/styles/tokens.css`):
```css
--paper: #FCFBF8;   /* clean newsprint: white with a little warmth */
--ink: #1A1714;     /* near-black */
--ink-soft: #4A443D;
--rule: #2B2622;
--accent: #F2C12E;  /* Wes Anderson yellow: fills, strokes, underlines; use sparingly */
--accent-text: #86600A; /* mustard: the accent wherever it is type or a thin line (AA on paper) */
--highlighter: #FFE84D; /* highlighter-pen yellow: only for the marker stroke (MarkerStroke.astro) */
```
No dark mode at launch: the paper is the identity.

**Layout and ornament:**
- A multi-column newspaper grid on desktop that collapses to a single column on mobile.
- Hairline and double rules between sections and columns, not cards.
- Lead images may be photographs, paintings or line art. Line art on a white ground uses `mix-blend-mode: multiply` so the white disappears. Cards crop the image to a 16:9 banner across the card.
- Use drop caps on article openings.
- Use printer's ornaments (❧ ☞ ✠) as dividers and bullets, sparingly.

**Never:** rounded corners, box shadows, gradients, emoji, pill buttons, hero carousels, stock photos, or anything that looks like a SaaS template.

**Illustrations:** store public-domain images in `public/illustrations/` and record source and credit for every image in `public/illustrations/credits.json`. Always show the credit on the page.

---

## Standards

- Mobile-first and responsive, with no horizontal scroll at 375px.
- Accessible: semantic HTML, alt text on every image, visible focus states, and WCAG AA contrast.
- Pages must load fast. Use Astro's `<Image>`, minimal client JS, and islands only when necessary.
- Build one component at a time and add each to `/styleguide` when it's done.

## Workflow

- Build in the phase order below. Finish and verify a page before starting the next.
- Commit after every working step with a clear message.
- Run `npm run build` before committing; never commit a broken build.
- Explain non-obvious decisions briefly in commit messages or comments. I'm learning as I build.

## Phases

1. Setup, tokens, fonts, base layout, masthead, footer, `/styleguide`. Deploy. (done)
2. Article page and content collection (done)
3. Homepage (done)
4. Games
   - 4a Games hub + Real or Absurdist
   - 4b Policy Reversal (adversarial Wordle-style word game)
   - 4c Personality quiz
   - 4d Authors & Faces (public-domain authors only)
   - 4e Crossword + reader puzzle submissions (Tally)
   - 4f Caption contest (Tally submissions, editor-picked winners)
   - 4g The Mayor (Reigns-style swipe-decision game: original art, cards, and look; meters are Treasury, Public, Council, Press)
5. Section fronts (done)
6. Contributors and portfolio pages (done)
7. Store and commissions (done)
8. Submit, About, Support, newsletter (built; waiting on the Tally, Stripe and Buttondown addresses in `src/data/site.ts`)
9. Polish, 404, SEO and Open Graph images, favicon (done)
10. Accounts, comments, likes via Supabase (reader accounts are live on Supabase, with password or emailed-link sign-in; the online editing desk is built and waits on the GitHub App setup)
