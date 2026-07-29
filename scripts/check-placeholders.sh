#!/usr/bin/env bash
# Warns about anything still left as a placeholder in public/.
# Run it before you point a domain at this site or spend money on traffic.
#
#   ./scripts/check-placeholders.sh
#
# Exits 0 always — this is a checklist, not a gate.
set -uo pipefail
cd "$(dirname "$0")/.."

PATTERNS=(
  'YOUR-FORM-ID:Formspree endpoint not set (leads will NOT be saved)'
  'YOUR-USERNAME:Calendar booking link not set'
  'YOUR-EMAIL@example.com:Contact email not set (shows on all legal pages)'
  'YOUR JURISDICTION:Governing law not set in Terms of Service'
  'REPLACE-WITH-YOUR-DOMAIN:Domain not set in canonical tags / sitemap / robots'
  'YOUR-HANDLE:Social links not set'
  'Placeholder — do not publish:Testimonial placeholder still on /sales/'
)

found=0
echo "Checking public/ for unfinished setup..."
echo
for entry in "${PATTERNS[@]}"; do
  needle="${entry%%:*}"
  message="${entry#*:}"
  hits=$(grep -rIl -- "$needle" public wrangler.toml 2>/dev/null || true)
  if [ -n "$hits" ]; then
    found=1
    printf '  [ ] %s\n' "$message"
    printf '        %s\n' $hits
  fi
done

if [ "$found" -eq 0 ]; then
  echo "  All placeholders resolved. Good to send traffic."
else
  echo
  echo "See SETUP.md for what each item means."
fi
