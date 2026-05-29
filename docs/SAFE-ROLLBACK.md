# Safe Rollback

## Pattern

1. Backup before every change.
2. Generate a diff.
3. Validate syntax.
4. Apply to one test client.
5. Observe for 30 to 60 minutes.
6. Roll back immediately if critical checks fail.

## Placeholder rollback command

```bash
sudo /usr/local/sbin/example-rollback-client-policy
```

Never mass-rollout a policy change without testing.
