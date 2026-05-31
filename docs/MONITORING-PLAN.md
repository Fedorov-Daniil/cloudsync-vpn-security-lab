# Monitoring Plan

The monitoring plan focuses on visibility. It answers practical questions: is the service reachable, is DNS returning the expected answer, is the certificate healthy, and is backup readiness documented?

## Monitors

| Monitor | Example target | Purpose | Suggested interval |
| --- | --- | --- | --- |
| TCP 443 | `example.com:443` | Confirms HTTPS port reachability | 60 seconds |
| HTTP status | `https://example.com/` | Confirms web response | 60 seconds |
| DNS response | `example.com` | Confirms expected DNS answer | 5 minutes |
| DoH behavior | `https://doh.example.com/dns-query` | Checks DNS security concept endpoint | 5 minutes |
| SSL/TLS expiry | `example.com:443` | Warns before certificate expiry | 12 hours |
| Disk usage | host metric | Detects storage pressure | 5 minutes |
| RAM usage | host metric | Detects resource pressure | 5 minutes |
| Container health | container status | Detects failed service containers | 1 minute |
| Backup freshness | marker or evidence | Confirms recent backup readiness signal | 12 hours |

## Alert Levels

- **Info:** useful state change, no expected impact.
- **Warning:** risk is increasing, such as certificate expiry under 30 days.
- **Critical:** service is down, certificate expired, backup evidence missing, or recovery path unclear.

## Report Inputs

- Uptime percentage.
- Incident count and duration.
- Certificate expiry status.
- DNS observations.
- Backup readiness status.
- Recommendations and next actions.

## Demo Target File

See [../examples/monitoring-targets.example.yml](../examples/monitoring-targets.example.yml).
