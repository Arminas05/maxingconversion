# Setup — from this repo to a live site

Two parts: **deploy it** (once, ~5 minutes), then **configure it** (one file).

---

## Part 1 — Deploy to Cloudflare Workers

The repo is already connected to the **`maxingconversion` Worker** on your
account, and the build runs `npx wrangler deploy`. Nothing to set up in the
dashboard — just push, or hit **Retry deployment** on the last build.

The site deploys as an **assets-only Worker**: no server code, no build step,
no entry point. `wrangler.toml` points at `./public` and Cloudflare uploads it.

> **Note on Pages vs Workers.** This project is a Worker, not a Pages project.
> Static-asset Workers are the current recommended path and support `_headers`
> and `_redirects` natively, exactly like Pages did. Don't add
> `pages_build_output_dir` to `wrangler.toml` — that's Pages-only config and
> `wrangler deploy` fails on it.

You get a URL like `maxingconversion.<your-subdomain>.workers.dev`. Every push
to the production branch redeploys; other branches get their own preview URL
(`preview_urls = true`).

### Which branch deploys — check this before trusting the word "preview"

The Worker's build is bound to **one** branch, and whatever that branch is,
pushing to it goes **straight to the live domain**. There is no staging step.

Set it to `main` under **the Worker → Settings → Build → Branch control**, so
that feature branches are genuinely preview-only and `main` is the thing that
ships. If GitHub still shows a long `claude/...` branch as the repo default,
switch that too under **GitHub → Settings → Branches**.

This bit off by default: the Worker was originally connected when the repo's
only branch was the working branch, so production tracked *that*, and pushes
intended as previews were published live. If you are ever unsure which branch
is live, open any deploy log from a PR comment — the URL contains the
environment it built into.

### Attach your domain

The site is wired for **`maxingconversion.com`** already — `wrangler.toml`
declares it as a Custom Domain (plus `www`), and every canonical tag,
`robots.txt` and `sitemap.xml` point at it. There is one manual step first,
at your domain registrar, that can't be done from this repo:

1. **Add `maxingconversion.com` as a zone on this Cloudflare account** (or
   confirm it already is one) — Cloudflare dashboard → **Add a Site** — and
   point the domain's nameservers at the two Cloudflare ones it gives you.
   Custom Domains only attach to zones Cloudflare already controls.
2. Once that zone is active, the **next push redeploys the Worker and
   creates the Custom Domain automatically** — no dashboard click needed,
   because it's declared in `wrangler.toml`. SSL is issued for you.
3. If you'd rather do it by hand instead: Worker → **Settings** →
   **Domains & Routes** → **Add** → **Custom domain**.

Using a different domain? Edit the two `pattern` values in `wrangler.toml`,
then find-and-replace `maxingconversion.com` across the repo (canonical
tags, `robots.txt`, `sitemap.xml`).

### Submitting the sitemap to Google

Search Console → **Indexing → Sitemaps → Add a new sitemap**. The field
already shows your domain as a fixed prefix, so type **just the filename**:

```
sitemap.xml
```

Typing `maxingconversion.com/sitemap.xml` there produces
`https://maxingconversion.com/maxingconversion.com/sitemap.xml` and fails
with *"Invalid sitemap address"* — that error means the path was wrong, not
that the sitemap is broken.

*"Couldn't fetch"* is a different thing and usually means Google tried
before the file was deployed. Confirm the file loads in a browser first,
then resubmit; the status can take a day to settle even when it's fine.

**What belongs in `sitemap.xml`:** only genuinely indexable pages —
currently `/toolkit/` (priority 1.0, since `/` redirects there) and
`/sales/` (0.8). Deliberately excluded:

- the four legal pages — they carry `<meta name="robots" content="noindex">`,
  so listing them would claim "index this" and "don't index this" at once
  and earn a *"Submitted URL marked noindex"* error
- `/404.html` — an error page
- the `#thanks` views — hash routes of pages already listed, not separate URLs

`robots.txt` deliberately does **not** `Disallow:` the legal pages. A
disallowed page is never fetched, so its `noindex` is never read and the
bare URL can still get listed. Allowing the crawl is what lets the
`noindex` actually be obeyed.

Update `<lastmod>` when a page's *content* meaningfully changes — bumping it
on every deploy trains crawlers to ignore the field. `scripts/smoke-test.mjs`
checks every listed URL returns 200, doesn't redirect, isn't noindexed, has a
matching canonical, and isn't robots-blocked.

---

## Part 2 — Configure the funnel

**Everything you need to edit is in one file: [`public/assets/config.js`](public/assets/config.js).**
No HTML editing required.

Run this any time to see what's still unfinished:

```bash
./scripts/check-placeholders.sh
```

### The checklist

| # | Setting in `config.js` | Where to get it | Why it matters |
|---|---|---|---|
| 1 | `brandName` | you | Shows in every footer and legal page |
| 2 | `contactEmail` | you | **Required** — legal pages must have a reachable contact address |
| 3 | `jurisdiction` | you | Governing law in the Terms of Service |
| 4 | `calendarUrl` | [calendly.com](https://calendly.com) or [cal.com](https://cal.com) | Where people land after the qualifier |
| 5 | `formspreeUrl` | [formspree.io](https://formspree.io) (free tier is fine) | **Without this, qualifier answers are lost.** The visitor still reaches your calendar, but you never see who they are or what they answered |
| 6 | `socials` | you | Powers the exit-intent popup. Leave the array empty and the popup never fires — which is the right default until you have somewhere to send people |
| 7 | `vslEmbedUrl` | later — see below | Hero video |
| 8 | `thankYouEmbedUrl` | later — see below | "Watch before your call" video |

### One thing you must set in Calendly

In your scheduler's **post-booking redirect**, set:

```
https://maxingconversion.com/sales/#thanks
```

That `#thanks` is what swaps the page over to the thank-you view — the
prep instructions, the do-nots, and the second video slot. Without it,
people book and see the scheduler's generic confirmation instead.

---

## Adding the VSL later

You don't need to touch any HTML. Both video slots are hidden until a URL
exists, because an empty video box costs more conversions than no box at all.

When the video is ready, put the **embed** URL (not the share URL) in
`config.js`:

```js
vslEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
```

| Platform | Embed URL format |
|---|---|
| YouTube | `https://www.youtube.com/embed/VIDEO_ID` |
| Vimeo | `https://player.vimeo.com/video/VIDEO_ID` |
| Loom | `https://www.loom.com/embed/VIDEO_ID` |

Push, and it appears at the top of `/sales/`. Same for
`thankYouEmbedUrl`, which also un-hides the "click play" arrow above it.

---

## Before you send paid traffic

- [ ] `./scripts/check-placeholders.sh` comes back clean
- [ ] Book a test call yourself, end to end, and confirm the lead email arrives
- [ ] Confirm the `#thanks` redirect fires after booking
- [ ] Delete the placeholder testimonial block on `/sales/` (search for
      `proof-slot`) — or replace it with a real client result
- [ ] Have a lawyer read the four legal pages. They are solid starting
      templates, not legal advice, and the profit-share language in the
      Terms has real weight once money changes hands
- [ ] If you add Google Analytics or a Meta Pixel, update
      `/cookie-policy/` and the Cookies section of `/privacy-policy/`
      **and** add a consent banner before those scripts load

---

## About the price

`/sales/` deliberately has **no price on it**. The page explains the fee
structure (setup fee + percentage) and says the numbers come on the call.

If you later want a number on the page, set a real one you'll honour, and
don't add a struck-through "was" price unless that price genuinely existed.
A fabricated anchor is the fastest way to lose a reader who reads twice.
