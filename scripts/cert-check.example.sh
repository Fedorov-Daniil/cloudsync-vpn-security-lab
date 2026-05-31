#!/usr/bin/env bash
set -euo pipefail

# CloudSync SafeOps certificate expiry example.
# Read-only check against placeholder hostnames.

host="${1:-example.com}"
port="${2:-443}"
warn_days="${WARN_DAYS:-30}"

command -v openssl >/dev/null 2>&1 || {
  echo "Missing required command: openssl" >&2
  exit 2
}

expiry_raw="$(
  echo | openssl s_client -servername "$host" -connect "${host}:${port}" 2>/dev/null |
    openssl x509 -noout -enddate 2>/dev/null |
    sed 's/^notAfter=//'
)"

if [[ -z "$expiry_raw" ]]; then
  echo "Certificate status: WARN - unable to read certificate for ${host}:${port}"
  exit 1
fi

expiry_epoch="$(date -d "$expiry_raw" +%s 2>/dev/null || date -j -f "%b %e %T %Y %Z" "$expiry_raw" +%s 2>/dev/null)"
now_epoch="$(date +%s)"
days_left="$(( (expiry_epoch - now_epoch) / 86400 ))"

echo "Host: ${host}:${port}"
echo "Certificate expiry: ${expiry_raw}"
echo "Days left: ${days_left}"

if (( days_left < 0 )); then
  echo "Certificate status: CRITICAL - expired"
  exit 1
elif (( days_left < warn_days )); then
  echo "Certificate status: WARN - below ${warn_days} days"
else
  echo "Certificate status: PASS"
fi
