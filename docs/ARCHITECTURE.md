# Architecture

This is a sanitized model using placeholder values.

```text
Client Device
    |
    | encrypted client connection
    v
VPN Gateway (vpn.example.com / 203.0.113.10)
    |
    +--> DNS Filtering Layer (AdGuard Home)
    |        |
    |        +--> DoH Endpoint (https://doh.example.com/dns-query)
    |
    +--> Monitoring Checks
    |
    +--> Backup Workflow
    |
    +--> GitHub-safe Documentation
```

## Components

- Client: phone or desktop using a sanitized routing policy.
- VPN gateway: placeholder gateway used for the lab model.
- DNS filtering layer: conservative DNS filtering and review.
- DoH endpoint: encrypted DNS transport for clients.
- Monitoring: reachability, TLS, resources, and backup freshness.
- Backup workflow: local and encrypted off-server backup design.
- Documentation: runbooks, checklists, and rollback notes.
