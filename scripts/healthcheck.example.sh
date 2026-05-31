#!/usr/bin/env bash
set -euo pipefail

# CloudSync SafeOps read-only health check example.
# Uses placeholder domains only and does not change local or remote systems.

website_url="${1:-https://example.com/}"
doh_url="${2:-https://doh.example.com/dns-query}"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 2
  }
}

http_code() {
  local url="$1"
  curl -fsS -o /dev/null -w "%{http_code}" -I "$url" || true
}

need_cmd curl

website_code="$(http_code "$website_url")"
doh_code="$(http_code "$doh_url")"

echo "CloudSync SafeOps health check"
echo "Website: ${website_url} -> HTTP ${website_code}"
echo "DoH check: ${doh_url} -> HTTP ${doh_code}"

if [[ "$website_code" =~ ^2|3 ]]; then
  echo "Website status: PASS"
else
  echo "Website status: WARN"
fi

if [[ "$doh_code" =~ ^2|3|4 ]]; then
  echo "DoH endpoint behavior: PASS"
else
  echo "DoH endpoint behavior: WARN"
fi
