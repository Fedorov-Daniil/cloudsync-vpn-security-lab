# Incident Response

CloudSync SafeOps uses small, repeatable incident workflows. The goal is to detect, communicate, restore, and learn without making the situation worse.

## General workflow

1. Confirm the alert.
2. Identify the affected service.
3. Check recent changes.
4. Estimate client impact.
5. Communicate status if impact is visible.
6. Apply the safest recovery step.
7. Roll back the latest relevant change when appropriate.
8. Document the incident and prevention action.

## Website down

- Check HTTP status and TCP 443.
- Confirm DNS still resolves.
- Check certificate validity.
- Review hosting or container health.
- Use rollback notes if a recent change caused impact.

## DNS broken

- Compare expected DNS records with current answers.
- Check TTL and propagation status.
- Confirm registrar or DNS provider status.
- Roll back the last DNS record change if needed.

## Certificate expired

- Confirm expiry date and affected hostnames.
- Renew or reissue through the approved provider process.
- Validate HTTPS response after renewal.
- Add a monitoring warning threshold if missing.

## Disk full

- Confirm disk usage with read-only checks.
- Identify growth source.
- Avoid deleting unknown data.
- Escalate before cleanup if logs, databases, or backups are involved.

## Backup failed

- Confirm last successful backup.
- Check storage availability.
- Review scheduler status.
- Run a controlled manual backup only in the approved environment.
- Document missed recovery point.

## Config rollout issue

- Stop expanding the rollout.
- Compare baseline and changed state.
- Roll back the smallest relevant change.
- Validate service health.
- Capture what failed before retrying.

## Client communication

Use clear and calm updates:

- what is affected;
- when it started;
- what is being checked;
- next update time;
- recovery result;
- prevention action.

## Incident report

Use [../examples/incident-report.example.md](../examples/incident-report.example.md).
