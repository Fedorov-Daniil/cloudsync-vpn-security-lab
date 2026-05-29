#!/usr/bin/env bash
set -euo pipefail

echo "Checking placeholder endpoints"
curl -fsS --max-time 10 https://vpn.example.com/health >/dev/null || echo "WARN: VPN health endpoint unavailable"
curl -kI --max-time 10 https://doh.example.com/dns-query || true
df -h /
free -h
