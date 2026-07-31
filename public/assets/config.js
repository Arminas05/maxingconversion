/* ═══════════════════════════════════════════════════════════════════════
   SITE CONFIG — this is the only file you have to edit to go live.
   Every page reads from it. See SETUP.md for the step-by-step.
   ═══════════════════════════════════════════════════════════════════════ */

window.SITE_CONFIG = {

  /* ── 1. Brand + legal details ─────────────────────────────────────
     These three appear on the legal pages. Fill them in before you
     send any traffic — a policy with a missing contact address is
     worse than no policy.                                             */
  brandName:    'Maxing Conversion',
  contactEmail: 'YOUR-EMAIL@example.com',
  jurisdiction: 'YOUR JURISDICTION',   // e.g. 'England and Wales', 'Lithuania'
  effectiveDate: '29 July 2026',       // date the current policies took effect

  /* ── 2. Booking link (Calendly / Cal.com / SavvyCal) ───────────────
     In your scheduler, set the post-booking redirect to:
        https://maxingconversion.com/sales/#thanks
     That is what shows the thank-you page.                             */
  calendarUrl: 'https://calendly.com/hello-maxingconversion/30min',

  /* Where the "Reschedule" button on the thank-you page points.
     Leave blank to hide the button.                                    */
  rescheduleUrl: '',

  /* ── 3. Form endpoint (formspree.io — free tier is fine) ───────────
     Looks like: https://formspree.io/f/xxxxxxxx
     If this is left as-is, qualifier answers are NOT saved anywhere —
     the visitor still reaches your calendar, but you lose the data.    */
  formspreeUrl: 'https://formspree.io/f/YOUR-FORM-ID',

  /* ── 4. Videos — LEAVE BLANK UNTIL THE VIDEO EXISTS ────────────────
     An empty video box costs more conversions than no box, so the
     placeholder frames stay hidden until you put a URL here.
     Use the EMBED url, not the share url:
        YouTube → https://www.youtube.com/embed/VIDEO_ID
        Vimeo   → https://player.vimeo.com/video/VIDEO_ID
        Loom    → https://www.loom.com/embed/VIDEO_ID                   */
  vslEmbedUrl: '',          // hero video at the top of /sales/
  thankYouEmbedUrl: '',     // "watch before your call" video on #thanks

  /* ── 5. Socials (exit-intent popup). Delete any you're not on. ───── */
  socials: [
    // { label: 'Instagram', url: 'https://instagram.com/YOUR-HANDLE' },
    // { label: 'YouTube',   url: 'https://youtube.com/@YOUR-HANDLE'  },
    // { label: 'X / Twitter', url: 'https://x.com/YOUR-HANDLE'       }
  ],

  /* ── 6. Behaviour toggles ─────────────────────────────────────────── */
  exitIntentEnabled: true,

  /* ── 7. The $47 toolkit at /toolkit/ ───────────────────────────────
     TWO switches, and BOTH must be set before the page can take money.
     Both are now set and the product is genuinely live:
       • the skill files exist and ship (deliverables/toolkit-v1/)
       • Stripe payment fires a Zapier automation that emails the
         buyer the toolkit zip, so "instant download" is accurate
     If either is ever unset again, /toolkit/ makes its buy buttons
     inert, explains why, and forces itself to noindex.               */

  // true — the files exist and a buyer receives them automatically.
  productLive: true,

  // Stripe Payment Link for the $47 toolkit (dashboard → Payment Links).
  stripePaymentUrl: 'https://buy.stripe.com/4gM6oAdRLeYK9rL1FI1ck00',

  productPrice: '$47',

  /* Where buyers land after paying. Set this as the Payment Link's
     confirmation-page URL in Stripe too, or they see Stripe's default. */
  productThanksUrl: 'https://maxingconversion.com/toolkit/#thanks'
};
