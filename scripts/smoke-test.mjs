/* Browser smoke test for the funnel.
 *
 *   cd public && python3 -m http.server 8787   # in one terminal
 *   npm i playwright && node scripts/smoke-test.mjs
 *
 * Checks the qualifier flow end to end, the FAQ accordions, the sticky
 * mobile CTA, the #thanks route, and that the legal pages fill their
 * tokens from config.js. */
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

// 1. sales page: modal flow end to end
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
const qualCount = await p.locator('.wb-qual').count();
if (qualCount < 1) errors.push('sales: no qualification blocks found');
const proofTags = await p.locator('.wb-proof-slot .tag').allInnerTexts();
if (proofTags.some(t => !/placeholder/i.test(t))) errors.push('sales: a proof slot is missing its placeholder label');

// reveal-on-scroll elements should end up visible after scrolling past them.
// Step down gradually — a single giant jump can skip frames the
// IntersectionObserver never sees, unlike a real human's scroll.
for (let i = 0; i < 12; i++) {
  await p.mouse.wheel(0, 500);
  await p.waitForTimeout(120);
}
const stillHidden = await p.locator('.reveal:not(.is-visible)').count();
if (stillHidden > 0) errors.push(`sales: ${stillHidden} .reveal elements never became visible after scrolling`);

await p.screenshot({ path: '/tmp/shot-sales.png', fullPage: false });

// /sales/ #thanks route
await p.goto(base + '/sales/#thanks', { waitUntil: 'networkidle' });
if (!(await p.isVisible('#view-thanks'))) errors.push('sales: #thanks did not show thank-you view');
if (await p.isVisible('#view-optin')) errors.push('sales: opt-in still visible on #thanks');
await p.close();

// 2. strategy-call: opt-in view + sticky CTA on mobile
p = await page('/strategy-call/', 390, 780);
if (!(await p.isVisible('#view-optin'))) errors.push('sc: opt-in view not visible');
if (await p.isVisible('#view-thanks')) errors.push('sc: thanks view visible on opt-in');
await p.mouse.wheel(0, 2500);
await p.waitForTimeout(400);
if (!(await p.isVisible('#stickyCta'))) errors.push('sc: sticky CTA did not appear on mobile scroll');
await p.screenshot({ path: '/tmp/shot-sc-mobile.png' });

// 3. thank-you view via hash
await p.goto(base + '/strategy-call/#thanks', { waitUntil: 'networkidle' });
if (!(await p.isVisible('#view-thanks'))) errors.push('sc: #thanks did not show thank-you view');
if (await p.isVisible('#view-optin')) errors.push('sc: opt-in still visible on #thanks');
if (await p.isVisible('#ty-play-prompt')) errors.push('sc: play prompt visible with no video set');
if (await p.isVisible('#rescheduleBtn')) errors.push('sc: reschedule button visible with no url set');
await p.close();

// 4. legal pages fill their tokens
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

// 5. 404
const np = await page('/404.html');
await np.close();

await browser.close();
if (errors.length) { console.log('FAILURES:\n' + errors.join('\n')); process.exit(1); }
console.log('All checks passed.');
