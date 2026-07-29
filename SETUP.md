# Setup — from this repo to a live site

Two parts: **deploy it** (once, ~5 minutes), then **configure it** (one file).

---

## Part 1 — Deploy to Cloudflare Pages

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) →
   **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick **`Arminas05/maxingconversion`**.
3. Build settings — Cloudflare reads `wrangler.toml` and fills these in.
   If it asks, use:

   | Field | Value |
   |---|---|
   | Framework preset | None |
   | Build command | *(leave empty)* |
   | Build output directory | `public` |
   | Production branch | `claude/github-cloudflare-setup-srwghd` |

   That branch is currently the repo's default, because it's the only one.
   If you'd rather deploy from `main`, create it first
   (`git checkout -b main && git push -u origin main`), set it as the default
   in **GitHub → Settings → Branches**, and pick it here instead.

4. **Save and Deploy.** You get a URL like
   `maxingconversion.pages.dev` within about a minute.

Every push to the production branch redeploys automatically. Pushes to other
branches get their own preview URL, so you can look at a change before it's
live.

### Attach your domain

Pages → your project → **Custom domains** → **Set up a domain**. If the
domain's nameservers are already on Cloudflare, this is two clicks and the
SSL certificate is issued for you.

Then find-and-replace `REPLACE-WITH-YOUR-DOMAIN.com` across the repo —
it appears in the canonical tags, `robots.txt` and `sitemap.xml`.

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
https://yourdomain.com/strategy-call/#thanks
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

Push, and it appears on both `/strategy-call/` and `/sales/`. Same for
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
