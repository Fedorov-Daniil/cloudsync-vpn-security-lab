# Incident Response

Incident response in this lab is intentionally simple: confirm, scope, communicate, recover, document, and improve.

## General Workflow

1. Confirm the alert.
2. Identify the affected service.
3. Check recent changes.
4. Estimate user impact.
5. Choose the safest recovery step.
6. Roll back the latest relevant change when appropriate.
7. Validate monitoring.
8. Document the incident and prevention action.

## Common Scenarios

### Website Down

- Check HTTP status and TCP 443.
- Confirm DNS still resolves.
- Check certificate validity.
- Review service health indicators.
- Use rollback notes if a recent change caused impact.

### DNS Issue

- Compare current DNS answers with expected records.
- Check TTL and propagation assumptions.
- Confirm provider status where applicable.
- Roll back the last DNS record change in the lab scenario if needed.

### Certificate Expiry

- Confirm expiry date and affected hostname.
- Renew through the documented process in a real environment.
- Validate HTTPS response after renewal.
- Add or adjust warning thresholds.

### Disk Pressure

- Use read-only checks first.
- Identify the growth source.
- Avoid deleting unknown data.
- Document the finding and safe next action.

### Backup Failure

- Confirm last successful backup.
- Check destination availability.
- Record missed recovery point.
- Schedule a restore readiness review.

### Rollout Issue

- Stop expanding the change.
- Compare baseline and changed state.
- Roll back the smallest relevant change.
- Validate service health.
- Capture what failed before retrying.

## Incident Report

Use [../examples/incident-report.example.md](../examples/incident-report.example.md).
