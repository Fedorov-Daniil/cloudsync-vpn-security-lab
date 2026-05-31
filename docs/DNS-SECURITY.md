# DNS Security

DNS security in CloudSync SafeOps is about reducing common exposure, improving visibility, and documenting safe resolver behavior for small projects.

## Goals

- Reduce access to known phishing and malware domains.
- Encourage safer DNS resolver choices.
- Check DNS response behavior for important domains.
- Document DNS changes before they affect users.
- Keep DNS troubleshooting understandable for non-specialists.

## Recommended checks

- Domain resolves to expected placeholder records in examples.
- DNS response is consistent across chosen resolvers.
- Important records are documented: `A`, `AAAA`, `CNAME`, `MX`, `TXT`, and relevant verification records.
- TTL values are known before planned changes.
- DoH endpoint behavior is checked where applicable.
- Filtering recommendations are conservative and reviewed for false positives.

## Example DNS inventory

| Item | Example value | Purpose |
| --- | --- | --- |
| Primary domain | `example.com` | Client website |
| Operations domain | `safeops.example.com` | Demo status/reporting endpoint |
| DNS security endpoint | `doh.example.com` | DoH behavior check |
| Placeholder IP | `203.0.113.10` | Documentation-only address |

## Safe DNS change process

1. Capture current records.
2. Confirm intended record values.
3. Lower TTL before planned changes when appropriate.
4. Apply one small change at a time.
5. Validate resolution from multiple networks or resolvers.
6. Watch monitoring after the change.
7. Document the result and rollback path.

## Limitations

DNS filtering reduces risk but does not eliminate phishing, malware, account takeover, compromised websites, or endpoint security issues. It is one layer in a broader operations routine.
