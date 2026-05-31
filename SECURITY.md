# Security Policy

CloudSync SafeOps is a sanitized portfolio project. Public files must contain placeholders only and must never include live infrastructure values or sensitive operational material.

## Reporting a concern

If you notice a risky value in this repository, open a private report with the file path, line number, and why it looks sensitive. Do not paste the value into public issues.

## What must not be committed

- Passwords, tokens, API keys, private keys, SSH keys, and certificates with private key material.
- `.env` files, database dumps, backup archives, raw access logs, or browser/session data.
- Real customer data, production domains, production IP addresses, subscription links, or private operational URLs.

## Approved placeholders

Use only these public-safe placeholders:

- `example.com`
- `customer.example`
- `safeops.example.com`
- `doh.example.com`
- `203.0.113.10`
- `REDACTED`

## Safe contribution rules

- Keep example scripts read-only.
- Do not include commands that modify firewall, web server, DNS server, VPN, container runtime, package manager, SSH, or live production configuration.
- Prefer checklists, diagrams, templates, and demo reports over real exported configuration.
- Run the included scan workflow before publishing changes.
