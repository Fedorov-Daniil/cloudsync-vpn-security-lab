# CloudSync SafeOps Monthly Health Report

## Client

Example Customer

## Period

2026-05-01 to 2026-05-31

## Overall score

**86/100 - Healthy with small follow-up actions**

## Uptime summary

| Service | Target | Status | Notes |
| --- | --- | --- | --- |
| Website | `https://example.com/` | Healthy | No major downtime detected |
| HTTPS port | `example.com:443` | Healthy | TCP checks passed |
| DNS response | `example.com` | Healthy | Expected placeholder response |
| DoH behavior | `https://doh.example.com/dns-query` | Watch | Review response behavior monthly |

## Incidents

| Date | Duration | Impact | Status |
| --- | ---: | --- | --- |
| 2026-05-14 | 7 minutes | Website returned intermittent 5xx responses | Resolved |

## SSL certificate status

| Host | Days remaining | Status |
| --- | ---: | --- |
| `example.com` | 64 | Healthy |
| `safeops.example.com` | 52 | Healthy |

## DNS/security observations

- DNS records are documented and match the expected baseline.
- No urgent DNS security issues found in the demo baseline.
- Continue conservative filtering review to reduce phishing and malware exposure.

## Backup readiness

| Item | Status | Notes |
| --- | --- | --- |
| Local backup | Ready | Last example check: 2026-05-30 |
| Off-server encrypted copy | Partial | Confirm schedule and retention |
| Restore test | Due | Plan an isolated restore test next month |

## Recommendations

- Add certificate warning at 30 and 7 days before expiry.
- Confirm backup restore procedure on an isolated test environment.
- Add a monthly alert-channel test.
- Keep DNS record inventory updated after every change.

## Next actions

1. Confirm off-server backup retention.
2. Schedule restore test.
3. Review DoH endpoint monitor behavior.
4. Send next monthly report by 2026-06-30.
