# Incident Response

## Service down

Check status, ports, containers, endpoint health, disk, and memory. Avoid broad restarts until the failing layer is identified.

## DNS issue

Check DoH reachability, DNS filtering status, recent block events, and platform allowlists.

## Client policy rollout issue

Rollback the latest policy, test one client, and document the failure.

## Certificate issue

Check expiry, issuer, DNS resolution, and renewal process.

## Disk full

Identify large logs, backups, and database growth. Do not run destructive cleanup without a reviewed plan.
