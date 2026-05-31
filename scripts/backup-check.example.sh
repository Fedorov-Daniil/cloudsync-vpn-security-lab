#!/usr/bin/env bash
set -euo pipefail

# CloudSync SafeOps backup readiness example.
# This script only reads a marker file path supplied by the operator.

marker_path="${1:-/tmp/cloudsync-safeops-backup.marker}"
max_age_hours="${MAX_BACKUP_AGE_HOURS:-36}"

if [[ ! -f "$marker_path" ]]; then
  echo "Backup freshness: WARN - marker not found at ${marker_path}"
  exit 1
fi

if command -v stat >/dev/null 2>&1; then
  if stat -c %Y "$marker_path" >/dev/null 2>&1; then
    marker_epoch="$(stat -c %Y "$marker_path")"
  else
    marker_epoch="$(stat -f %m "$marker_path")"
  fi
else
  echo "Backup freshness: WARN - stat command not available"
  exit 1
fi

now_epoch="$(date +%s)"
age_hours="$(( (now_epoch - marker_epoch) / 3600 ))"

echo "Backup marker: ${marker_path}"
echo "Age hours: ${age_hours}"

if (( age_hours > max_age_hours )); then
  echo "Backup freshness: WARN - older than ${max_age_hours} hours"
  exit 1
fi

echo "Backup freshness: PASS"
