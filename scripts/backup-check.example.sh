#!/usr/bin/env bash
set -euo pipefail

backup_dir="${1:-./backups}"
find "$backup_dir" -maxdepth 1 -type f -mtime -2 -print | head -20
