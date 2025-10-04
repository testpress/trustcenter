---
title: "Weak TLS protocols should be rejected (TLS 1.0 / TLS 1.1)"
description: "Verify that legacy and insecure TLS versions are disabled and rejected by the server, while modern TLS versions remain functional."
---

Weak TLS protocols should be rejected (TLS 1.0 / TLS 1.1)

## Purpose
Verify the server rejects old and insecure TLS versions.

## Pre-conditions

* HTTPS endpoint reachable.

## Tools

* `openssl` (client)
* `testssl.sh` or `nmap` (optional)

## Steps

```bash
# Test TLS 1.0
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1 2>&1 | sed -n '1,200p'

# Test TLS 1.1
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_1 2>&1 | sed -n '1,200p'

# Test TLS 1.2 and TLS 1.3 to confirm modern versions work
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_2 2>&1 | sed -n '1,200p'
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_3 2>&1 | sed -n '1,200p'

# Optional: Use testssl.sh to get full compatibility matrix
./testssl.sh <HOST>:443
```

## Expected Result:

* `openssl` attempts for `-tls1` and `-tls1_1` should fail to negotiate a session (e.g., `handshake failure` or `no shared cipher`).
* `-tls1_2` and `-tls1_3` should succeed if the client supports them.
* No successful connection using TLS 1.0/1.1.

## Actual Result:
✅ **Pass**

```text
# Example output/screenshot reference:
![TLS 1.0/1.1 Rejection Result](/api/attachments.redirect?id=24af23f7-ff15-4cf5-8c8a-3a28834e3230)

# Notes:
# - TLS 1.0/1.1 attempts returned handshake failures.
# - TLS 1.2/1.3 negotiated successfully from test clients.
```