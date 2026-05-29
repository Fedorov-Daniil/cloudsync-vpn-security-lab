#!/usr/bin/env bash
set -euo pipefail

target="${1:-.}"
grep -RInE 'BEGIN (OPENSSH|RSA|EC|PRIVATE)|authorization:|cookie:|DATABASE_URL|API_KEY|TOKEN' "$target" || true
