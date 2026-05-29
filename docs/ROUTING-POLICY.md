# Routing Policy

This document describes a sanitized Shadowrocket-like policy. It uses placeholder domains only.

## Rule order

1. Private and local networks use `DIRECT`.
2. Trusted local or regional services use `DIRECT`.
3. Selected remote services use `PROXY`.
4. A final fallback catches everything else.
5. DNS uses a DoH endpoint.

## Example

- `IP-CIDR,10.0.0.0/8,DIRECT,no-resolve`
- `DOMAIN-SUFFIX,example-bank.local,DIRECT`
- `DOMAIN-SUFFIX,video.example,PROXY`
- `GEOIP,PRIVATE,DIRECT`
- `FINAL,PROXY`

The point is predictable ordering and low-risk rollout, not a real production policy.
