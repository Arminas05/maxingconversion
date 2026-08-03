---
name: sales-page-builder-wb
description: Build a sales page using the long-form conversational "if you're on this page, I'm going to presume..." formula — the one that opens by naming the reader's problem back to them, walks through proof and story, and only asks for the sale after it has earned it. Use this for landing pages, sales pages and offer pages when the goal is a warm, personal, direct-response feel rather than a clipped modern layout.
---

# Sales Page Builder — WB conversational formula

**This is a playground copy.** The original lives at
`deliverables/toolkit-v1/sales-page-builder/` and ships to buyers unchanged —
edit this file freely, that one deliberately not.

Builds one complete, working HTML sales page. The output is a real file that
opens in a browser and can be clicked through.

## What makes this formula different

The default sales-page structure states things. This one *talks* — it opens
by guessing why the reader is here, agrees with them, and only then offers
help. That's what makes it feel like a person rather than a brochure, and
it's why the early sections are written as presumptions and questions rather
than claims.

The other defining move: every promise is delivered push-button style — *what
they want, without what they hate*. Whenever you describe what the customer
must do, describe how little it is.

## Step 1 — Get the offer clear

Ask for whatever is missing, but don't stall — a strong draft with flagged
assumptions beats an interrogation:

1. **Who it's for** — one sentence a stranger would recognise themselves in.
2. **Their four pains**, in escalating order — the surface problem, the thing
   they're unsure of, the thing that keeps them up at night, and the one that
   chills them to the bone. The formula uses all four, separately.
3. **What's being sold and the real price.** Never invent a number.
4. **The mechanism** — how it works, in one plain sentence.
5. **Real proof** — client names, results, screenshots, testimonials. If
   there are none, say so; the page uses labelled placeholders, never
   invented quotes.
6. **Their dread list** — what they hate. This powers every "without…" line.

## Step 2 — The sequence

Follow this order. Each beat does a job, and the early ones exist to earn the
right to make the later ones.

| # | Beat | What goes here |
|---|---|---|
| 1 | **The presumption** | "If you're on this page, I'm going to presume you're here because… [problem]." Immediately name who should and shouldn't be reading. |
| 2 | **Pain escalation** | "You're tired of… Perhaps you're also thinking about… You're frustrated by…" — surface pain, then the 3am thought, then the deepest fear. Three separate paragraphs, escalating. |
| 3 | **The offer of help** | "If that's the case, I can help." Then *briefly* how. Then: "How would that impact your…?" |
| 4 | **How it works** | Explain the mechanism — but *wow, not how*. Enough to be credible, not a manual. |
| 5 | **Handle early scepticism** | "I know what you're thinking — is this real?" Name the doubt out loud before they finish forming it. |
| 6 | **Hard proof** | Graphics, screenshots, numbers. Real ones or a labelled placeholder. |
| 7 | **Testimonials** | "But don't take my word for it." |
| 8 | **"Sound too good to be true?"** | Name a client who thought so, then their specific result. Then: "Imagine achieving [outcome] for yourself. And the best part? All they did was [push-button description]." |
| 9 | **Your journey + mistakes** | "It took me weeks and months to… I made all the usual mistakes: [2-3 mistakes the reader is making right now]." This handles "why can't I just do it myself?" |
| 10 | **Why they haven't heard of it** | "If you're thinking 'why haven't I heard of this before' — [simple reason]." Then: "Most people struggle with [pain]. So why are you doing what they do?" |
| 11 | **Imagine / future-pace** | "Imagine you [got the solution]. Picture yourself not having to [pain]. Imagine removing [second pain]. How would that impact your [their world]?" |
| 12 | **The offer** | "Would you like [solution] along with my personal help?" Then what it is — and crucially: "What you're really getting isn't just [minor outcome] — it's control, confidence, and [major outcome]." |
| 13 | **Push-button description** | "All you need to do is [tiny thing]. And no, it's not confusing or overly detailed. It's [simple description]." |
| 14 | **"If they can do it, why can't you?"** | Repeat with a different testimonial each time. Powerful *only* with real names — with placeholders, use one, not five. |
| 15 | **First CTA** | "Your job is simple: learn X, apply Y, get Z. So what are you waiting for?" Then the button. |
| 16 | **What happens after you join** | Instant access, sessions, extras, group. For the readers who need more before deciding. |
| 17 | **Guarantee** | The real terms, including anything the buyer must do to qualify. |
| 18 | **Scarcity** | Only if genuinely true — a real cap, a real reason. See honesty rules. |
| 19 | **The two paths close** | "If you'd prefer to carry on [pain], I can't stop you. What I can do is help you [outcome] without [what they hate]. If you'd prefer that — [CTA]." |

Beats 1–3 are the ones people get wrong most often by rushing. The reader
must feel *recognised* before they'll accept help, and that only comes from
naming the pain in their own words at three depths.

## Step 3 — The push-button rule

Every time the page describes work the customer does, describe how little it
is. "All Sarah did was answer four questions" beats "Sarah completed the
onboarding module." Attach ease-markers — *simplest, fastest, all you do is,
already done for you* — to their effort, never to your product's features.

Pair every want with the removal of a dread: "get the page, without hiring a
copywriter, without a monthly fee, and without touching code."

## Step 4 — Build it as a real, working page

- Buttons are real `<button>` or `<a>` elements, never dead `<div>`s.
- Forms validate the email format and show a real success state, no reload.
- FAQ accordions genuinely open and close.
- If checkout isn't wired up, say so visibly — never a silently dead button,
  and never a fake "purchase complete".
- One self-contained HTML file. It should open by double-clicking it.

## Step 5 — Honesty rules

This formula is persuasive enough to sell things that aren't true, so these
aren't optional garnish — a reader who catches one exaggeration stops
believing the whole page.

- **Never invent** a testimonial, client name, result, "was $X" price, or
  user count. No real proof yet? Use a visibly-labelled placeholder — an
  obvious gap converts better than an invented quote, and a fabricated
  result is a legal problem too.
- **Scarcity must be real.** "Only 10 clients a month" is fine if true and
  you can say why. A countdown that resets is a trust-killer. If the user
  asks for urgency with no real constraint behind it, tell them plainly and
  offer capacity-based framing instead.
- **Guarantees must be honourable as written**, including any conditions the
  buyer has to meet. Don't write "no questions asked" if questions will be
  asked.
- **No guaranteed income claims.** "Here's what clients have done" — never
  "you will make X."
- **Ease claims must survive contact with the product.** If it takes twenty
  minutes, don't write five. The push-button style works on *framing* the
  real effort as small, not on misstating it.

## Output

One complete HTML file, presented as a file the user can open — not a code
block. If they ask for copy only, write it in the chat following the beat
order above, clearly labelled, and skip the HTML.
