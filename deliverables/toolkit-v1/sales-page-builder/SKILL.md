---
name: sales-page-builder
description: Build a complete, working HTML sales page for an offer — a course, coaching program, service, guide, or lead magnet — using a proven direct-response structure (problem, proof, offer, price, guarantee, FAQ, close). Use this whenever the user wants a sales page, landing page, opt-in page, or checkout page, even if they just describe an offer and say "build a page for this."
---

# Sales Page Builder

Builds one complete, working HTML sales page from an offer description. The
output is a real file that opens in a browser and can be clicked through —
not a mockup, not a wireframe, not a copy doc pretending to be a page.

## Step 1 — Get the offer clear before writing

Ask the user for whatever of this is missing before drafting:

1. **Who it's for** — the specific person and situation. "Business owners"
   is not specific enough — push for one sentence a stranger would recognize
   themselves in.
2. **What's being sold, and at what price** — a free thing only, a single
   paid offer, or a free thing that leads into a paid one. Get a real price
   if there is one. Never invent a number — ask.
3. **The mechanism** — what they get and how it works, in one plain sentence.
4. **Any real proof** — a testimonial, result, or credibility marker. If
   there isn't one yet, say so; the page will use an honest placeholder
   instead of a fake one (see Step 5).

If the user gives an incomplete brief, don't stall on it — build the
strongest reasonable draft and flag the assumptions out loud, especially
price. Ask at most one clarifying question if something is genuinely
unclear.

## Step 2 — Follow this section order

Each section does a specific job. Skipping or reordering breaks the logic
that moves a skeptical stranger toward clicking the button.

| Section | Job |
|---|---|
| **Hero** | Who this is for and the core promise, in one glance. The main button is visible immediately. |
| **Problem** | Name their exact pain in language they'd use themselves. |
| **How it works** | Explain the mechanism simply — then say what this removes (complexity, pressure, wasted time) and what it keeps (fast, simple, proof-backed). |
| **Proof** | One specific, concrete testimonial or result beats a list of generic claims. If there's no real one yet, use a clearly labeled placeholder — never a fabricated one. |
| **Offer reveal** (paid only) | State exactly what's included. |
| **Price** (paid only) | The real price. If there's a genuine "was" price (an actual past or list price), show it struck through — never invent one. |
| **Guarantee** | Remove the last bit of risk, and only promise what would actually be honored. |
| **FAQ** | 3–5 real objections a buyer of *this specific thing* would have — not generic filler. |
| **Final CTA** | Restate the one next step, once more, plainly. |

## Step 3 — Build it as a real, working page

- The button must be a real `<button>` or link, not a dead `<div>`.
- If there's a form (email opt-in), validate the email format and show a
  real success state on submit — no page reload.
- If there's an FAQ, make the accordion actually open and close on click.
- If there's a checkout button but no real payment link to wire up yet,
  make that obvious — a clearly labeled "connect your payment link here"
  note, not a silently broken button and not a button that fakes a
  successful purchase.
- Everything inline: one self-contained HTML file, CSS and JS included, no
  external build step. It should open correctly by double-clicking it.

## Step 4 — Honesty rules (non-negotiable)

- Never invent a testimonial, a specific result, a "was $X" price, or a
  countdown/scarcity claim that isn't real. A page that lies about a fact
  the user could be held to is worse than a plainer page that's true.
- If proof doesn't exist yet, write a placeholder that visibly reads as a
  placeholder (e.g. `[ADD A REAL RESULT HERE]`) rather than something that
  could pass as a real claim.

## Output

Deliver one complete HTML file. Present it as a file the user can open, not
as a code block to read. If they ask for "just the copy" without a page,
give the copy in the chat using the section order above, clearly labeled,
and skip the HTML.
