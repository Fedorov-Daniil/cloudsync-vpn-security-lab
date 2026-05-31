# Security Policy

CloudSync SafeOps is a sanitized portfolio lab. Public files must contain placeholders only and must never include live infrastructure values or sensitive operational material.

## Reporting a Concern

If you notice a risky value in this repository, report the file path, line number, and why it looks sensitive. Do not paste sensitive values into public issues.

## What Must Not Be Committed

- Credentials, access material, SSH material, or non-public cryptographic material.
- `.env` files, database dumps, backup archives, raw access logs, or browser state.
- Real personal data, production domains, production IP addresses, subscription links, or private operational URLs.

## Approved Placeholders

Use only these public-safe placeholders:

- `example.com`
- `safeops.example.com`
- `doh.example.com`
- `monitor.example.com`
- `203.0.113.10`
- `REDACTED`

## Safe Contribution Rules

- Keep example scripts read-only.
- Do not include commands that modify firewall, web server, DNS server, VPN, container runtime, package manager, SSH, or live production configuration.
- Prefer checklists, diagrams, templates, and demo reports over real exported configuration.
- Run the included checks before publishing changes.
