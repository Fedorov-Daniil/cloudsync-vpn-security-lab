# Incident Report

## Date/time

- Detected at: 2026-05-14 11:22 Europe/Moscow
- Resolved at: 2026-05-14 11:29 Europe/Moscow

## Affected service

- Service: Example Website
- Target: `https://example.com/`

## Symptoms

- Intermittent HTTP 5xx responses.
- Uptime monitor changed to critical state.

## Detection source

- Monitoring alert: HTTP status check.
- Manual confirmation: `scripts/healthcheck.example.sh`

## Actions taken

1. Confirmed the alert from a second network.
2. Checked DNS response and TLS status.
3. Reviewed recent change notes.
4. Notified the client contact with a short status update.
5. Restored service after the platform recovered.

## Root cause placeholder

`REDACTED - replace with confirmed root cause after investigation.`

## Rollback

- Rollback needed: No
- Rollback plan reference: `REDACTED`

## Prevention

- Add warning threshold for repeated 5xx responses.
- Include incident in monthly report.
- Review platform status page during future similar events.
