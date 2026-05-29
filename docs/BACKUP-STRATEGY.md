# Backup Strategy

## Goals

- Keep documentation in Git.
- Keep backup artifacts outside Git.
- Use encrypted off-server storage for critical restore material.
- Test restore procedures on isolated systems.

## Retention example

- Small configuration snapshots: 14 days.
- Database exports: 7 days locally, longer encrypted off-server retention if needed.
- Restore documentation: versioned in Git.
