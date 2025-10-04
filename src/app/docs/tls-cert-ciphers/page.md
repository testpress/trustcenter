---
title: "Verify TLS certificate details and strong cipher suites"
description: "Confirm the server uses valid TLS certificates and supports only strong, modern cipher suites (TLS 1.2+), ensuring secure encrypted communications."
---

Verify TLS certificate details and strong cipher suites

## Purpose
Confirm the certificate is valid (issuer, subject, expiry) and the server only supports modern TLS (1.2+) and strong ciphers.

## Pre-conditions

* HTTPS endpoint reachable (port 443 or configured HTTPS port).

## Tools

* `openssl`
* `openssl x509` / `openssl s_client`
* `nmap` with `--script ssl-enum-ciphers` (optional)
* Browser certificate viewer (optional)

## Steps

```bash
# Inspect certificate (issuer, validity dates, SANs)
echo | openssl s_client -connect <HOST>:443 -servername <HOST> 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates -ext subjectAltName

# View full certificate chain
openssl s_client -connect <HOST>:443 -servername <HOST> -showcerts

# Check supported TLS versions and ciphers
nmap --script ssl-enum-ciphers -p 443 <HOST>

# Check for HSTS header (optional)
curl -I https://<HOST>/ | grep -i Strict-Transport-Security || true
```

(Optional) Inspect certificate in browser (click padlock → certificate).

## Expected Result:

* **Certificate:**
  * Issuer = valid CA (Let's Encrypt, customer CA, or internal trusted CA).
  * `Not Before` / `Not After` dates indicate certificate is currently valid.
  * Subject / SAN includes the hostname clients use.
* **Cipher/TLS policy:**
  * TLS 1.2 and TLS 1.3 supported; TLS 1.0 and 1.1 disabled.
  * Only strong ciphers offered (AEAD ciphers like `TLS_AES_128_GCM_SHA256`, ECDHE suites). No RC4, DES, or export ciphers.
* **HSTS header:** Present for the domain (recommended).

## Actual Result:
✅ **Pass**

```text
# Example command used:
echo | openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates -ext subjectAltName

# SSL Labs Report (example):
https://www.ssllabs.com/ssltest/analyze.html?d=storage1.tpstreams.com

# Example image/report reference:
![SSL Labs Result](/api/attachments.redirect?id=6ee5e90b-3143-4887-be38-55ab5a35c4df)
```