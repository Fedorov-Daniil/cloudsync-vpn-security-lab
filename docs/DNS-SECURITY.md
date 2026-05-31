# DNS Security

This lab uses DNS security as a learning topic: how DNS records are documented, how resolver behavior can be checked, and how conservative filtering can reduce common exposure.

## Goals

- Understand DNS record ownership and expected answers.
- Practice documenting DNS changes before rollout.
- Learn where DNS filtering can help and where it cannot.
- Check DoH endpoint behavior with placeholder targets.
- Avoid overclaiming security outcomes.

## Example Inventory

| Item | Placeholder | Purpose |
| --- | --- | --- |
| Primary domain | `example.com` | Demo website |
| Monitoring domain | `monitor.example.com` | Demo monitoring target |
| DoH endpoint | `doh.example.com` | DNS security concept check |
| Documentation IP | `203.0.113.10` | Public documentation placeholder |

## Safe DNS Change Process

1. Capture the current expected records.
2. Define the intended change.
3. Check TTL and propagation expectations.
4. Apply one small change in the lab scenario.
5. Validate resolution from more than one resolver.
6. Monitor behavior after the change.
7. Document the result and rollback notes.

## Limitations

DNS filtering can reduce exposure to known malicious or unwanted domains, but it does not replace endpoint security, user training, secure application design, or incident response.
