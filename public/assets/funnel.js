/* ═══════════════════════════════════════════════════════════════════════
   funnel.js — shared behaviour for every page in the funnel.

   Injects the sticky mobile CTA, the 5-step qualifier modal and the
   exit-intent popup into whatever page loads it, then wires up the FAQ
   accordions, the year stamps, the brand name and the video slots.

   Reads everything it needs from /assets/config.js — do not put URLs,
   handles or copy in this file.
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

var CFG = window.SITE_CONFIG || {};
var CALENDAR_URL  = CFG.calendarUrl  || '';
var FORMSPREE_URL = CFG.formspreeUrl || '';
var CONFIGURED_FORM = FORMSPREE_URL.indexOf('YOUR-FORM-ID') === -1 && FORMSPREE_URL !== '';

/* ─────────────────── markup injection ─────────────────── */

var STICKY_HTML = '' +
'<div class="sticky-cta" id="stickyCta">' +
'  <button class="btn" onclick="openModal()">Book My Free Strategy Call</button>' +
'</div>';

var MODAL_HTML = `
<!-- ═══════════════ QUALIFIER MODAL ═══════════════ -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <button class="modal-close" onclick="closeModal()" aria-label="Close">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
    </button>
    <div class="modal-body">
      <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>

      <div class="step active" data-step="1">
        <span class="step-label">Question 1 of 5</span>
        <h3>Where's your info product right now?</h3>
        <div class="option-grid" id="opts-1">
          <button class="option-btn" data-value="live_selling">Live and selling</button>
          <button class="option-btn" data-value="live_slow">Live but barely converting</button>
          <button class="option-btn" data-value="ready_soon">Built, launching soon</button>
          <button class="option-btn" data-value="idea">Still just an idea</button>
        </div>
      </div>

      <div class="step" data-step="2">
        <span class="step-label">Question 2 of 5</span>
        <h3>How big is your audience or email list?</h3>
        <div class="option-grid" id="opts-2">
          <button class="option-btn" data-value="none">No list yet</button>
          <button class="option-btn" data-value="under1k">Under 1,000</button>
          <button class="option-btn" data-value="1k-10k">1,000 – 10,000</button>
          <button class="option-btn" data-value="10k+">10,000+</button>
        </div>
      </div>

      <div class="step" data-step="3">
        <span class="step-label">Question 3 of 5</span>
        <h3>What's your current monthly revenue, roughly?</h3>
        <div class="option-grid" id="opts-3">
          <button class="option-btn" data-value="0-1k">$0 – $1,000</button>
          <button class="option-btn" data-value="1k-10k">$1,000 – $10,000</button>
          <button class="option-btn" data-value="10k-30k">$10,000 – $30,000</button>
          <button class="option-btn" data-value="30k+">$30,000+</button>
        </div>
      </div>

      <div class="step" data-step="4">
        <span class="step-label">Question 4 of 5</span>
        <h3>If we found a fit, how soon would you want this built?</h3>
        <div class="option-grid" id="opts-4">
          <button class="option-btn" data-value="now">Immediately — this is urgent</button>
          <button class="option-btn" data-value="30d">Within 30 days</button>
          <button class="option-btn" data-value="quarter">Next few months</button>
          <button class="option-btn" data-value="browsing">Just gathering information</button>
        </div>
      </div>

      <div class="step" data-step="5">
        <span class="step-label">Last step</span>
        <h3>Where should I send your call details?</h3>
        <div class="field-group">
          <label for="fName">Full name</label>
          <input type="text" id="fName" placeholder="Jane Smith" autocomplete="name">
          <div class="field-error" id="err-fName">Please enter your name.</div>
        </div>
        <div class="field-group">
          <label for="fEmail">Email</label>
          <input type="email" id="fEmail" placeholder="jane@example.com" autocomplete="email">
          <div class="field-error" id="err-fEmail">Please enter a valid email address.</div>
        </div>
        <div class="field-group">
          <label for="fPhone">Phone number</label>
          <input type="tel" id="fPhone" placeholder="+1 555 000 0000" autocomplete="tel">
          <div class="field-error" id="err-fPhone">Please enter a valid phone number.</div>
          <p class="privacy-note">Used only for a reminder before the call. Never shared or sold.</p>
        </div>
      </div>

      <div class="step" data-step="6">
        <div class="success-state">
          <div class="success-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M6 15l6 6L24 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3>Got it — one last step.</h3>
          <p>Taking you to my calendar so you can pick your time.</p>
          <div class="spinner"></div>
        </div>
      </div>

      <div class="step-nav" id="stepNav">
        <button class="btn-back" id="backBtn" onclick="prevStep()" style="display:none;">Back</button>
        <button class="btn btn-next" id="nextBtn" onclick="nextStep()" disabled>Continue</button>
      </div>
    </div>
  </div>
</div>
`;

var EXIT_HTML = '' +
'<div class="exit-overlay" id="exitOverlay">' +
'  <div class="exit-modal">' +
'    <button class="exit-close" onclick="closeExit()" aria-label="Close">' +
'      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
'    </button>' +
'    <h3>Not ready to book?</h3>' +
'    <p>Fair enough. Follow along instead — I break down real funnels and what\'s actually converting right now, no pitch attached.</p>' +
'    <div class="exit-socials" id="exitSocials"></div>' +
'  </div>' +
'</div>';

function injectMarkup(){
  var host = document.createElement('div');
  host.innerHTML = STICKY_HTML + MODAL_HTML + EXIT_HTML;
  while(host.firstChild) document.body.appendChild(host.firstChild);
}

/* ─────────────────── small page helpers ─────────────────── */

function stampYear(){
  var y = new Date().getFullYear();
  document.querySelectorAll('.year').forEach(function(el){ el.textContent = y; });
}

function stampBrand(){
  document.querySelectorAll('.brand-name').forEach(function(el){
    el.textContent = CFG.brandName || '';
  });
}

/* Video slots stay hidden until a real embed URL exists in config.js.
   An empty video box costs more conversions than no box at all. */
function mountVideo(frameId, url, alsoShowId){
  var frame = document.getElementById(frameId);
  if(!frame) return;
  if(!url){ frame.hidden = true; return; }
  frame.innerHTML = '<iframe src="' + url + '" title="Video" loading="lazy" ' +
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
    'allowfullscreen></iframe>';
  frame.hidden = false;
  if(alsoShowId){
    var extra = document.getElementById(alsoShowId);
    if(extra) extra.hidden = false;
  }
}

function mountReschedule(){
  var btn = document.getElementById('rescheduleBtn');
  if(!btn) return;
  if(CFG.rescheduleUrl){
    btn.href = CFG.rescheduleUrl;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.onclick = null;
  } else {
    btn.style.display = 'none';
  }
}

function mountSocials(){
  var box = document.getElementById('exitSocials');
  if(!box) return;
  var list = CFG.socials || [];
  box.innerHTML = list.map(function(s){
    return '<a href="' + s.url + '" class="exit-social-btn" target="_blank" rel="noopener">' + s.label + '</a>';
  }).join('');
}

/* ─────────────────── FAQ accordion ─────────────────── */

window.toggleFaq = function(btn){
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
  if(!wasOpen) item.classList.add('open');
};

/* ─────────────────── sticky mobile CTA ─────────────────── */

var heroObserver = null;
function observeHeroBtn(){
  var stickyCta = document.getElementById('stickyCta');
  var heroBtn = document.querySelector('.hero .btn');
  if(!heroBtn || !stickyCta) return;
  if(heroObserver) heroObserver.disconnect();
  heroObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      var optin = document.getElementById('view-optin');
      var onOptin = !optin || optin.classList.contains('active');
      stickyCta.classList.toggle('visible', onOptin && !e.isIntersecting && window.innerWidth < 900);
    });
  }, {threshold: 0});
  heroObserver.observe(heroBtn);
}

/* ─────────────────── qualifier modal ─────────────────── */

var currentStep = 1;
var totalSteps = 6;
var answers = {};

window.openModal = function(){
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};
window.closeModal = function(){
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
};

function updateProgress(){
  document.getElementById('progressFill').style.width = (currentStep / totalSteps * 100) + '%';
}

function showStep(n){
  document.querySelectorAll('.step').forEach(function(s){ s.classList.remove('active'); });
  document.querySelector('.step[data-step="' + n + '"]').classList.add('active');
  updateProgress();

  var backBtn = document.getElementById('backBtn');
  var nextBtn = document.getElementById('nextBtn');
  var stepNav = document.getElementById('stepNav');

  backBtn.style.display = (n > 1 && n < 6) ? 'inline-flex' : 'none';

  if(n === 6){
    stepNav.style.display = 'none';
  } else {
    stepNav.style.display = 'flex';
    nextBtn.textContent = (n === 5) ? 'Book My Call' : 'Continue';
    nextBtn.disabled = !isStepValid(n);
  }
}

function isStepValid(n){
  if(n >= 1 && n <= 4) return !!answers['step' + n];
  if(n === 5) return validateName(false) && validateEmail(false) && validatePhone(false);
  return true;
}

function validateName(show){
  var v = document.getElementById('fName').value.trim();
  var ok = v.length >= 2;
  setErr('fName', !ok && show); return ok;
}
function validateEmail(show){
  var v = document.getElementById('fEmail').value.trim();
  var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  setErr('fEmail', !ok && show); return ok;
}
function validatePhone(show){
  var v = document.getElementById('fPhone').value.trim();
  var ok = v.replace(/\D/g, '').length >= 7;
  setErr('fPhone', !ok && show); return ok;
}
function setErr(id, show){
  document.getElementById(id).classList.toggle('invalid', show);
  document.getElementById('err-' + id).classList.toggle('active', show);
}

window.nextStep = function(){
  if(currentStep <= 4 && !answers['step' + currentStep]) return;
  if(currentStep === 5){
    var ok = [validateName(true), validateEmail(true), validatePhone(true)].every(Boolean);
    if(!ok) return;
    answers.name  = document.getElementById('fName').value.trim();
    answers.email = document.getElementById('fEmail').value.trim();
    answers.phone = document.getElementById('fPhone').value.trim();
    submitQualifier();
    return;
  }
  if(currentStep < totalSteps){ currentStep++; showStep(currentStep); }
};
window.prevStep = function(){
  if(currentStep > 1){ currentStep--; showStep(currentStep); }
};

function handoffToCalendar(){
  currentStep = 6;
  showStep(6);
  var url = CALENDAR_URL +
    '?name='  + encodeURIComponent(answers.name) +
    '&email=' + encodeURIComponent(answers.email) +
    '&a1='    + encodeURIComponent(answers.phone);
  setTimeout(function(){ window.location.href = url; }, 1400);
}

function submitQualifier(){
  var btn = document.getElementById('nextBtn');
  btn.disabled = true;
  btn.textContent = 'Booking...';

  var payload = {
    name: answers.name,
    email: answers.email,
    phone: answers.phone,
    product_stage: answers.step1 || '',
    audience_size: answers.step2 || '',
    monthly_revenue: answers.step3 || '',
    timeline: answers.step4 || '',
    source_page: window.location.pathname
  };

  if(!CONFIGURED_FORM){
    console.warn('[funnel] formspreeUrl is not set in /assets/config.js — ' +
                 'this lead was NOT saved. See SETUP.md.');
    handoffToCalendar();
    return;
  }

  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
  .catch(function(err){ console.error('Form submission failed:', err); })
  .finally(handoffToCalendar);
}

/* ─────────────────── exit intent ─────────────────── */

var exitShown = false;
window.closeExit = function(){
  document.getElementById('exitOverlay').classList.remove('active');
};

function wireExitIntent(){
  if(!CFG.exitIntentEnabled) return;
  if(!(CFG.socials && CFG.socials.length)) return;  // nothing to offer, so don't nag
  document.addEventListener('mouseleave', function(e){
    var optin = document.getElementById('view-optin');
    var onOptin = !optin || optin.classList.contains('active');
    var modalOpen = document.getElementById('modalOverlay').classList.contains('active');
    if(e.clientY < 10 && !exitShown && onOptin && !modalOpen){
      document.getElementById('exitOverlay').classList.add('active');
      exitShown = true;
    }
  });
}

/* ─────────────────── init ─────────────────── */

function init(){
  injectMarkup();
  stampYear();
  stampBrand();
  mountReschedule();
  mountSocials();
  mountVideo('vsl-frame', CFG.vslEmbedUrl);
  mountVideo('ty-video-frame', CFG.thankYouEmbedUrl, 'ty-play-prompt');

  document.getElementById('modalOverlay').addEventListener('click', function(e){
    if(e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeModal(); closeExit(); }
  });

  [1,2,3,4].forEach(function(n){
    document.getElementById('opts-' + n).addEventListener('click', function(e){
      var btn = e.target.closest('.option-btn');
      if(!btn) return;
      this.querySelectorAll('.option-btn').forEach(function(b){ b.classList.remove('selected'); });
      btn.classList.add('selected');
      if(!btn.querySelector('.check')){
        var c = document.createElement('span'); c.className = 'check'; btn.appendChild(c);
      }
      answers['step' + n] = btn.dataset.value;
      document.getElementById('nextBtn').disabled = false;
    });
  });

  ['fName','fEmail','fPhone'].forEach(function(id){
    var el = document.getElementById(id);
    el.addEventListener('input', function(){
      validateName(false); validateEmail(false); validatePhone(false);
      document.getElementById('nextBtn').disabled = !isStepValid(5);
    });
    el.addEventListener('blur', function(){
      if(id === 'fName')  validateName(true);
      if(id === 'fEmail') validateEmail(true);
      if(id === 'fPhone') validatePhone(true);
    });
  });

  wireExitIntent();
  observeHeroBtn();
  wireScrollReveal();
  wireProductButtons();
}

/* ---------- Paid product buttons (/toolkit/) ----------
   Two independent switches must BOTH be set in config.js before this page
   can take money: productLive (the files exist and can be delivered) and
   stripePaymentUrl (somewhere to send the payment). If either is missing
   the buttons are made inert, a plain-language notice explains why, and
   the page is forced to noindex so an ad or a search result can't drop
   someone onto a checkout that doesn't work.                            */
function wireProductButtons(){
  var buttons = document.querySelectorAll('[data-buy]');
  if(!buttons.length) return;

  var url = CFG.stripePaymentUrl || '';
  var ready = CFG.productLive === true && url !== '';

  // Keep the displayed price in sync with config so it can't drift
  // between the four offer blocks.
  if(CFG.productPrice){
    document.querySelectorAll('[data-price]').forEach(function(el){
      el.textContent = CFG.productPrice;
    });
  }

  if(ready){
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){ window.location.href = url; });
    });
    return;
  }

  var why = CFG.productLive !== true
    ? 'This product isn’t finished yet, so it isn’t on sale.'
    : 'Checkout isn’t connected yet, so this can’t take payment.';

  buttons.forEach(function(btn){
    btn.classList.add('is-inert');
    btn.setAttribute('aria-disabled', 'true');
    btn.addEventListener('click', function(e){ e.preventDefault(); });
  });
  document.querySelectorAll('[data-inert-note]').forEach(function(note){
    note.textContent = why + ' Nothing here can be bought yet.';
    note.hidden = false;
  });

  // Don't let search engines or ad crawlers index a page that can't sell.
  var meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  document.head.appendChild(meta);
}

/* ---------- MOTION: reveal-on-scroll for elements marked .reveal ----------
   Safety model: the hidden starting state lives behind html.js-reveal, which
   is only added here. If this function never runs, or IntersectionObserver
   is missing, every .reveal element simply stays visible — the page must
   never depend on JS to render its own content.                            */
function wireScrollReveal(){
  var els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)) return;   // leave everything visible

  var root = document.documentElement;
  root.classList.add('js-reveal');

  function revealAll(){
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('is-visible');
    });
  }

  // A tall element can never reach a high intersection ratio on a short
  // viewport, so trigger on any sliver of it entering the view.
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  // Positive bottom margin reveals a section ~250px BEFORE it scrolls into
  // view. On a long sales page that matters: it makes the motion read as a
  // gentle settle rather than a pop, and a fast scroller never outruns it
  // into blank space.
  }, {threshold: 0, rootMargin: '0px 0px 250px 0px'});
  els.forEach(function(el){ io.observe(el); });

  // Backstop: if the observer somehow never marks anything visible, show
  // everything rather than leaving the page blank.
  setTimeout(function(){
    if(!document.querySelector('.reveal.is-visible')) revealAll();
  }, 2500);
}

window.Funnel = { observeHeroBtn: observeHeroBtn };

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
