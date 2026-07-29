/* Small helper for the legal pages: stamps brand name, contact email,
   jurisdiction, effective date and the copyright year from config.js,
   so all four policies stay in sync from one file.

   Emails are rendered as mailto: links. Anything still unset shows the
   raw placeholder, deliberately — it should look wrong until it's fixed. */
(function(){
'use strict';
var CFG = window.SITE_CONFIG || {};

function fill(sel, value){
  document.querySelectorAll(sel).forEach(function(el){ el.textContent = value; });
}

fill('.brand-name',    CFG.brandName    || '[YOUR BUSINESS NAME]');
fill('.jurisdiction',  CFG.jurisdiction || '[YOUR JURISDICTION]');
fill('.effective-date', CFG.effectiveDate || '[EFFECTIVE DATE]');
fill('.year', new Date().getFullYear());

var email = CFG.contactEmail || '[YOUR EMAIL]';
document.querySelectorAll('.contact-email').forEach(function(el){
  if(email.indexOf('@') === -1 || email.indexOf('example.com') !== -1){
    el.textContent = email;
    return;
  }
  var a = document.createElement('a');
  a.href = 'mailto:' + email;
  a.textContent = email;
  el.textContent = '';
  el.appendChild(a);
});
})();
