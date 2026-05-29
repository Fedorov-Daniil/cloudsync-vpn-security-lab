# Monitoring Plan

## Checks

- TCP monitor for `vpn.example.com:443`.
- TCP monitor for `doh.example.com:443`.
- HTTPS monitor for the DoH path.
- Certificate expiry with warning at 30 days and critical at 7 days.
- Disk usage warning above 75 percent and critical above 90 percent.
- Memory availability warning below 500 MB.
- Container state checks.
- Backup freshness checks.

## Alerting

Start with low-noise alerts and tune thresholds after observing real behavior.
