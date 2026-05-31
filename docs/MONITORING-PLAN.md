# Monitoring Plan

The MVP monitoring plan is intentionally simple: check what matters, alert the right person, and make monthly status easy to explain.

## Monitors

| Monitor | Example target | Purpose | Suggested interval |
| --- | --- | --- | --- |
| TCP 443 | `example.com:443` | Confirms HTTPS port is reachable | 60 seconds |
| HTTP status | `https://example.com/` | Confirms expected web response | 60 seconds |
| DoH endpoint behavior | `https://doh.example.com/dns-query` | Confirms DNS security endpoint behavior | 5 minutes |
| SSL expiry | `example.com:443` | Warns before certificate expiry | 12 hours |
| Disk usage | host metric | Detects storage pressure | 5 minutes |
| RAM usage | host metric | Detects resource pressure | 5 minutes |
| Docker container health | container status | Detects failed service containers | 1 minute |
| Backup freshness | backup marker | Confirms recent backup exists | 12 hours |
| DNS response | `example.com` | Confirms expected DNS answer | 5 minutes |
| Alerting | email/chat placeholder | Confirms notification path | Monthly test |

## Alert levels

- **Info:** status changed but client impact is unlikely.
- **Warning:** risk is increasing, such as certificate expiry under 30 days.
- **Critical:** service is down, certificate expired, backup failed, or recovery path is unclear.

## Monthly reporting inputs

- Uptime percentage.
- Number and duration of incidents.
- Certificate expiry status.
- DNS and security observations.
- Backup readiness status.
- Recommendations and next actions.

## Demo target file

See [../examples/monitoring-targets.example.yml](../examples/monitoring-targets.example.yml).
