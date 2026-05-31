#!/usr/bin/env bash
set -euo pipefail

# CloudSync SafeOps sensitive-value scan example.
# It scans text files for risky markers while keeping this demo file sanitized.

target="${1:-.}"

patterns=(
  'BEGIN ''.*PRIVATE ''KEY'
  'pass''word'
  'to''ken'
  'sec''ret'
  'DATABASE''_URL'
  'DB''_URL'
  'api_''key'
  'bear''er'
  'cook''ie'
  'ses''sion'
  'authoriza''tion:'
)

joined="$(printf '%s\n' "${patterns[@]}" | paste -sd '|' -)"

if grep -RInE \
  --exclude-dir=.git \
  --exclude='SECURITY.md' \
  "$joined" "$target"; then
  echo "Sensitive-value scan: FAIL"
  exit 1
fi

echo "Sensitive-value scan: PASS"
