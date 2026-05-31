# Backup Strategy

This lab treats backups as an operational readiness topic. The public repository documents the process, but it never stores backup files or live exports.

## Backup Layers

- **Local copy:** fast recovery from small mistakes.
- **Off-server copy:** resilience if the host is unavailable.
- **Retention:** enough history to recover from delayed discovery.
- **Restore test:** proof that a backup can actually be used.
- **Integrity check:** confidence that backup data was not corrupted.

## Restore Readiness Checklist

- Backup location is known outside the public repo.
- Retention policy is documented.
- Restore owner is defined in the scenario.
- Restore process has been tested in an isolated environment.
- Last successful backup date is recorded.
- Integrity verification is available.

## What Never Goes to GitHub

- Backup archives.
- Database exports.
- Non-public cryptographic material.
- Personal or user records.
- Raw access logs.
- Environment files.
- Live production configuration.

## Monthly Report Fields

- Last backup date.
- Off-server copy status.
- Restore test status.
- Known gaps.
- Recommended next action.
