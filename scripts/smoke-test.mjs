/* Browser smoke test for the funnel.
 *
 *   cd public && python3 -m http.server 8787   # in one terminal
 *   npm i playwright && node scripts/smoke-test.mjs
 *
 * Checks the qualifier flow end to end, the sticky mobile CTA, the #thanks
 * route, that the legal pages fill their tokens from config.js, and — most
 * importantly — that the page actually RENDERS without JS having to run.
 * That last check exists because it didn't: a scroll-reveal that hid content
 * in plain CSS and relied on an IntersectionObserver to un-hide it shipped a
 * live page whose entire middle section was blank. Assertions that only run
 * after scripted scrolling cannot catch that; this file must always contain
 * at least one check of the page as first painted. */
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:8787';
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const errors = [];

async function page(path, w = 1280, h = 900) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION_RESET|ERR_CERT_AUTHORITY_INVALID/.test(m.text())) errors.push(`${path}: console ${m.text()}`); });
  p.on('pageerror', e => errors.push(`${path}: pageerror ${e.message}`));
  const r = await p.goto(base + path, { waitUntil: 'networkidle' });
  if (r.status() >= 400) errors.push(`${path}: HTTP ${r.status()}`);
  return p;
}

// ── 0. THE REGRESSION GUARD: content must paint with JS disabled ──────────
// If this fails, the page is hiding its own content behind a script again.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(base + '/sales/', { waitUntil: 'load' });
  const hidden = await p.$$eval('.reveal', els =>
    els.filter(e => parseFloat(getComputedStyle(e).opacity) < 0.9).length);
  if (hidden > 0) errors.push(`nojs: ${hidden} .reveal elements are invisible with JS disabled — content must not depend on JS to render`);
  // every qualification block must carry real text, not just occupy space
  const qualText = await p.$$eval('.wb-qual', els => els.map(e => e.innerText.trim().length));
  if (qualText.length === 0) errors.push('nojs: no qualification blocks rendered');
  if (qualText.some(l => l < 100)) errors.push('nojs: a qualification block rendered with almost no text');
  await ctx.close();
}

// Same check with JS ON but without scrolling — the state a visitor first sees.
{
  const p = await page('/sales/');
  await p.waitForTimeout(400);
  const aboveFoldHidden = await p.evaluate(() => {
    const vh = window.innerHeight;
    let n = 0;
    document.querySelectorAll('.reveal').forEach(e => {
      const r = e.getBoundingClientRect();
      const inView = r.top < vh && r.bottom > 0;
      if (inView && parseFloat(getComputedStyle(e).opacity) < 0.9) n++;
    });
    return n;
  });
  if (aboveFoldHidden > 0) errors.push(`onload: ${aboveFoldHidden} in-viewport .reveal elements still invisible after load`);
  await p.close();
}

// ── 1. sales page: qualifier modal flow end to end ────────────────────────
let p = await page('/sales/');
await p.click('.hero .btn');
if (!(await p.isVisible('#modalOverlay .step[data-step="1"]'))) errors.push('sales: modal did not open');
for (const step of [1, 2, 3, 4]) {
  await p.click(`#opts-${step} .option-btn >> nth=0`);
  await p.click('#nextBtn');
}
if (!(await p.isVisible('.step[data-step="5"]'))) errors.push('sales: did not reach contact step');
if (!(await p.isDisabled('#nextBtn'))) errors.push('sales: next enabled with empty contact fields');
await p.fill('#fEmail', 'not-an-email');
await p.fill('#fName', 'Jane Smith');
await p.fill('#fPhone', '+15550001111');
if (!(await p.isDisabled('#nextBtn'))) errors.push('sales: bad email accepted');
await p.fill('#fEmail', 'jane@example.com');
if (await p.isDisabled('#nextBtn')) errors.push('sales: valid contact details still disabled');

// Escape closes the modal
await p.keyboard.press('Escape');
if (await p.isVisible('#modalOverlay .step[data-step="5"]')) errors.push('sales: Escape did not close modal');

// video slot must stay hidden while config has no url
if (await p.isVisible('#vsl-frame')) errors.push('sales: empty VSL frame is visible');

// qualification-block placeholders must be visibly labeled, never silently missing
if ((await p.locator('.wb-qual').count()) < 1) errors.push('sales: no qualification blocks found');
const proofTags = await p.locator('.wb-proof-slot .tag').allInnerTexts();
if (proofTags.some(t => !/placeholder/i.test(t))) errors.push('sales: a proof slot is missing its placeholder label');

// reveal-on-scroll elements should all end up visible after scrolling past them
for (let i = 0; i < 12; i++) {
  await p.mouse.wheel(0, 500);
  await p.waitForTimeout(120);
}
const stillHidden = await p.locator('.reveal:not(.is-visible)').count();
if (stillHidden > 0) errors.push(`sales: ${stillHidden} .reveal elements never became visible after scrolling`);

// /sales/ #thanks route
await p.goto(base + '/sales/#thanks', { waitUntil: 'networkidle' });
if (!(await p.isVisible('#view-thanks'))) errors.push('sales: #thanks did not show thank-you view');
if (await p.isVisible('#view-optin')) errors.push('sales: opt-in still visible on #thanks');
await p.close();

// ── 2. mobile: sticky CTA + no horizontal overflow ────────────────────────
p = await page('/sales/', 390, 844);
await p.mouse.wheel(0, 2500);
await p.waitForTimeout(500);
if (!(await p.isVisible('#stickyCta'))) errors.push('mobile: sticky CTA did not appear on scroll');
const overflow = await p.evaluate(() => {
  const de = document.documentElement;
  return de.scrollWidth - de.clientWidth;
});
if (overflow > 1) errors.push(`mobile: page overflows horizontally by ${overflow}px`);
await p.close();

// ── 3. legal pages fill their tokens ──────────────────────────────────────
for (const path of ['/privacy-policy/', '/terms-of-service/', '/earnings-disclaimer/', '/cookie-policy/']) {
  const lp = await page(path);
  const brand = await lp.locator('.brand-name').first().innerText();
  if (!brand.trim()) errors.push(`${path}: brand name empty`);
  const body = await lp.locator('body').innerText();
  for (const tok of ['[YOUR BUSINESS NAME]', '[EFFECTIVE DATE]']) {
    if (body.includes(tok)) errors.push(`${path}: unfilled token ${tok}`);
  }
  await lp.close();
}

// ── 4. 404 ────────────────────────────────────────────────────────────────
const np = await page('/404.html');
await np.close();

await browser.close();
if (errors.length) { console.log('FAILURES:\n' + errors.join('\n')); process.exit(1); }
console.log('All checks passed.');
