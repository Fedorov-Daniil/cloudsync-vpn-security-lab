# DNS Security

The lab uses AdGuard Home concepts with DNS-over-HTTPS transport.

## Practices

- Start with conservative filtering.
- Use phishing and malware protection lists.
- Avoid aggressive lists that break login, payment, or platform services.
- Keep allowlist entries narrow and documented.
- Review query logs after changes.
- Monitor DoH endpoint availability and certificate expiry.

## Overblocking risk

Banking, payment, identity, app store, and push notification domains should be handled carefully. A canary device should test changes before rollout.
