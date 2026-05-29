# VPN Security Operations Lab

A sanitized portfolio project demonstrating secure operations practices for a personal VPN-like infrastructure lab: DNS protection, DNS-over-HTTPS filtering, safe configuration rollout, monitoring, backups, rollback planning, and incident response.

## About this project

This repository is a public, fully sanitized case study. It uses placeholder domains, placeholder IP addresses, and generic examples only.

## What this demonstrates

- Linux server administration.
- Docker operations.
- DNS security.
- DNS-over-HTTPS.
- Phishing and malware domain filtering.
- Configuration management.
- Rollback planning.
- Backup planning.
- Monitoring design.
- Operational documentation.
- Credential hygiene.
- Production change safety.

## Architecture overview

The lab models a client, a VPN gateway, a DNS filtering layer, a DoH endpoint, monitoring checks, backup workflows, and documentation-driven operations.

## Security goals

- Keep operational changes small and reversible.
- Separate public examples from real infrastructure values.
- Use conservative DNS filtering to reduce breakage.
- Verify service health after each change.
- Keep sensitive operational material out of Git.

## DNS protection with AdGuard Home and DoH

The design uses a DNS filtering layer with conservative blocklists, platform allowlists, query review, and health checks for the DoH endpoint.

## Client routing policy example

The example policy demonstrates local/private routes, trusted regional services, selected remote services, and a final fallback policy using placeholders only.

## Safe rollout strategy

Every change starts with backup, validation, one-client testing, monitoring, and rollback readiness before wider rollout.

## Backup and restore strategy

The lab separates documentation from backup artifacts. Restore tests are planned on isolated systems before any production use.

## Monitoring plan

The monitoring design covers TCP reachability, HTTPS status, DoH behavior, certificate expiry, disk, memory, containers, and backup freshness.

## Incident response

Run status checks first, isolate the failing layer, rollback the last change when appropriate, and document the outcome.

## What is intentionally not included

- Real IP addresses.
- Real domains.
- Live subscription links.
- Credential values.
- Raw logs.
- Customer data.
- Production configuration files.

## Skills demonstrated

Linux, networking, Docker operations, DNS security, DoH, monitoring, backups, rollback planning, incident response, operational writing, and safe maintenance discipline.

## Roadmap

- Add diagrams generated from generic architecture definitions.
- Add CI checks for link validation and scanning.
- Add more generic runbooks for DNS and certificate issues.
