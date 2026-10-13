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
- **Keystatic**: git-based CMS for editing content. Local mode, dev only: run `npm run dev` and open `http://127.0.0.1:4321/keystatic`. It is left out of the production build, so the deployed site stays static. It needs React (`@astrojs/react`, `react`, `react-dom`), used by the admin panel only.
- **TypeScript**, plain CSS with custom properties. **No Tailwind, no UI kits.**
- **Hosting**: Vercel (auto-deploy from `main`).
- **Newsletter**: Buttondown embed form.
- **Payments**: Stripe Payment Links (prints, donations). No cart.
- **Commissions**: Tally form embedded on artist pages.
- **Later, not now**: Supabase for accounts, likes, comments, saved articles.

Ask before adding any dependency not listed here.

---

## Content model

**Articles** (`src/content/articles/*.md`)
- `title`, `dek` (subheadline), `section`, `author` (ref), `illustrator` (ref, optional), `date`, `image`, `imageAlt` (optional), `imageCredit` (optional), `featured` (bool), `draft` (bool)
- `image` is a file name from `public/illustrations/` that has an entry in `credits.json`. `imageAlt` and `imageCredit` fall back to that entry when blank.
- In the body, a `>` blockquote is a pull quote (a second paragraph inside it is the attribution), and `![description](/illustrations/file.webp)` on its own line is an inline illustration with its credit added automatically.
- Schemas live in `src/content.config.ts` (validation) and `keystatic.config.ts` (the editing form). Change both together.

**Sections:** `politics`, `culture`, `education`, `money`, `comic`, `games`

**Contributors** (`src/content/contributors/*.md`)
- `name`, `role` (writer / illustrator / both), `bio` (the Markdown body), `portrait`, `links`, `commissionsOpen` (bool), `tallyFormUrl`

**Products** (`src/content/products/*.md`)
- `title`, `artist` (ref), `image`, `price`, `stripeLink`, `edition` (e.g. "1 of 50"), `available` (bool)

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage: masthead, lead story, recent articles, comic, recurring features, newsletter signup |
| `/[section]` | Section front |
| `/[section]/[slug]` | Article |
| `/contributors` and `/contributors/[slug]` | Portfolio, bio, published work, commission form |
| `/store` | Prints and commissions |
| `/submit` | Write for Us / Draw for Us / Create for Us |
| `/about`, `/support` | Mission, staff, donations |
| `/styleguide` | Living reference of every design element (dev only) |

---

## Design system

**The look:** an old newspaper crossed with an illustrated literary journal (*The Public Domain Review*). Authentic, collected, slightly eccentric, but clean, readable, and modern in usability.

**Masthead:** "The Municipal Absurdist" on one line in `Nova Cut`, with a small top hat centred above it. Beneath it the slogan in grey italic: *The world, as it unfortunately is*. Dateline bar below between thin rules.

**Small mark (for now):** the masthead's top hat as a solid silhouette with a green band (`public/favicon.svg`). The eventual mark: a side profile of a formally dressed, pipe-smoking gentleman seated on a Victorian high-tank toilet, using a laptop, drawn straight-faced in engraved line style. Needs a detailed version and a simplified silhouette for favicon and avatar sizes. Use a placeholder SVG until the artist delivers.

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
--accent: #1E5B3C;  /* bottle green; use sparingly */
```
No dark mode at launch: the paper is the identity.

**Layout and ornament:**
- A multi-column newspaper grid on desktop that collapses to a single column on mobile.
- Hairline and double rules between sections and columns, not cards.
- Illustrations are black line art on paper; use `mix-blend-mode: multiply` so white backgrounds disappear.
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

1. Setup, tokens, fonts, base layout, masthead, footer, `/styleguide`. Deploy.
2. Article page and content collection
3. Homepage
4. Section fronts
5. Contributors and portfolio pages
6. Store and commissions
7. Submit, About, Support, newsletter
8. Polish, 404, SEO and Open Graph images, favicon
9. (Later) Accounts, comments, likes via Supabase
