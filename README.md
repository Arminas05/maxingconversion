# maxingconversion

Static funnel site for the 7-day done-for-you funnel build offer.
Hosted on **Cloudflare Pages** — no build step, no framework, no dependencies.

**→ [SETUP.md](SETUP.md) — deploy it and fill in the config.**

## Pages

| Path | What it is |
|---|---|
| `/` | Redirects to `/strategy-call/` (change in `public/_redirects`) |
| `/sales/` | Long-form sales page for cold traffic — problem, mechanism, offer, guarantee, FAQ |
| `/strategy-call/` | The opt-in page: hero, qualifier modal, booking |
| `/strategy-call/#thanks` | Thank-you / call-prep view (same file, hash-routed) |
| `/privacy-policy/` | Privacy Policy |
| `/terms-of-service/` | Terms of Service |
| `/earnings-disclaimer/` | Earnings Disclaimer |
| `/cookie-policy/` | Cookie Policy |
| `/404.html` | Not-found page |

Short links `/call`, `/book`, `/privacy`, `/terms`, `/disclaimer` and
`/cookies` all redirect to the right place.

## How it fits together

```
public/
  assets/config.js    ← the only file you edit to go live
  assets/theme.css    ← all shared design tokens and components
  assets/funnel.js    ← qualifier modal, exit intent, FAQ, sticky CTA, video slots
  assets/legal.js     ← stamps brand/email/jurisdiction into the legal pages
  _redirects          ← Cloudflare Pages routing
  _headers            ← security + cache headers
```

The qualifier modal and exit-intent popup are **injected by `funnel.js`**, not
written into each page — so both the sales page and the strategy-call page get
identical behaviour from one implementation. Add a new page by including
`theme.css`, `config.js` and `funnel.js`, and calling `openModal()` from a
button.

### The lead flow

```
qualifier (5 steps) → POST to Formspree → redirect to your calendar
                                         (name/email/phone pre-filled)
        calendar redirects back to /strategy-call/#thanks → prep page
```

If `formspreeUrl` is unset, the visitor still reaches the calendar but the
answers are dropped and a warning is logged to the console. See SETUP.md.

## Local preview

```bash
cd public && python3 -m http.server 8787
# http://127.0.0.1:8787/sales/
```

Redirects in `_redirects` are a Cloudflare feature and won't apply locally —
open the real paths directly.

## Checks

```bash
./scripts/check-placeholders.sh   # what's still unconfigured
node scripts/smoke-test.mjs       # browser test (needs: npm i playwright)
```

CI (`.github/workflows/checks.yml`) runs a JS syntax check, an internal
link check, and prints the placeholder checklist to the run summary on
every push.

## Legal note

The four legal pages are general-purpose starting templates, not legal
advice. Have a lawyer review them before taking on paid clients —
particularly the client-engagement and profit-share language.
