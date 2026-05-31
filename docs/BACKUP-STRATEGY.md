# Backup Strategy

CloudSync SafeOps treats backups as a readiness process, not a file stored in Git.

## Backup layers

- **Local backups:** quick recovery from small configuration mistakes.
- **Encrypted off-server backups:** resilience against host loss or account issues.
- **Retention policy:** enough history to recover from delayed discovery of mistakes.
- **Restore tests:** periodic proof that backups are usable.
- **Checksum verification:** confidence that backup files were not corrupted.

## Suggested retention

| Backup type | Example retention | Notes |
| --- | --- | --- |
| Daily configuration backup | 7-14 days | Small files only |
| Weekly off-server backup | 4-8 weeks | Encrypted before transfer |
| Monthly archive | 3-6 months | Optional for higher plans |

## Restore readiness checklist

- Backup location is known.
- Backup encryption method is documented outside public Git.
- Restore owner is assigned.
- Restore procedure has been tested on an isolated environment.
- Last successful backup date is recorded.
- Checksums or integrity checks are available.

## What never goes to GitHub

- Backup archives.
- Database dumps.
- Private keys.
- Real client records.
- Raw access logs.
- Environment files.
- Production configuration exports.

## Monthly report fields

- Last backup date.
- Off-server copy status.
- Restore test status.
- Known gaps.
- Recommended next action.
