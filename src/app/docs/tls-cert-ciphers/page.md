---
title: "Verify TLS certificate details and strong cipher suites"
description: "Confirm the server uses valid TLS certificates and supports only strong, modern cipher suites (TLS 1.2+), ensuring secure encrypted communications."
---

# TLS Certificates and Cipher Suites

## Overview

TPStorage enforces the use of **valid TLS certificates** and **strong, modern cipher suites** for all HTTPS endpoints. This ensures that every client connection is encrypted, authenticated, and resilient against downgrade and cryptographic attacks.

## Why This Matters

Weak certificates or legacy cipher suites enable:

* **Impersonation** of service endpoints (invalid or misconfigured certs)
* **Interception** of plaintext data via man-in-the-middle (MITM)
* **Downgrades** to insecure protocols/ciphers (TLS 1.0/1.1, RC4/DES, export suites)

Enforcing modern TLS (1.2/1.3) and strong AEAD ciphers preserves **confidentiality, integrity, and authenticity** of data in transit.

## Control Description

* Only **TLS 1.2 and TLS 1.3** are permitted; TLS 1.0/1.1 are disabled.
* Only **strong AEAD suites** (e.g., TLS_AES_128_GCM_SHA256, ECDHE-GCM) are enabled; weak/legacy ciphers are disabled.
* Certificates are issued by a **trusted CA**, include correct **SANs**, and are actively monitored for **validity/expiry**.
* **HSTS** is set on HTTPS responses to enforce HTTPS on subsequent requests and reduce downgrade risk.

## Testing Methodology

**Preconditions**

* Public HTTPS endpoint is reachable.

**Tools**

* `openssl`, `nmap` (ssl-enum-ciphers), browser certificate viewer, `curl` (for HSTS)

**Steps**

1. **Certificate details**

   ```bash
   echo | openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com 2>/dev/null \
     | openssl x509 -noout -issuer -subject -dates -ext subjectAltName
   ```
2. **Supported protocols/ciphers**

   ```bash
   nmap --script ssl-enum-ciphers -p 443 storage1.tpstreams.com
   ```
3. **Legacy protocol rejection (sanity)**

   ```bash
   openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com -tls1    2>&1 | sed -n '1,20p'
   openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com -tls1_1  2>&1 | sed -n '1,20p'
   ```
4. **HSTS presence**

   ```bash
   curl -I https://storage1.tpstreams.com/ | grep -i Strict-Transport-Security || true
   ```

## Expected Behavior

* Certificate is **valid**, not expired, SANs include the service hostname.
* Only **TLS 1.2/1.3** negotiate; TLS 1.0/1.1 fail to handshake.
* Cipher offerings exclude weak/legacy algorithms.
* `Strict-Transport-Security` header is present on HTTPS responses.

## Actual Results

* Certificate presented by `storage1.tpstreams.com` is **valid** with correct issuer, subject, dates, and SANs.
* **TLS 1.0/1.1** handshakes fail as expected; **TLS 1.2/1.3** succeed with strong ciphers.
* **HSTS** header is present on HTTPS responses.

**External validation:**
An SSL Labs scan confirms a strong TLS configuration:
[https://www.ssllabs.com/ssltest/analyze.html?d=storage1.tpstreams.com](https://www.ssllabs.com/ssltest/analyze.html?d=storage1.tpstreams.com)

**Result:**

✅ Control Passed

**Last Verified:** 

2025-10-06

## Remediation (If Control Fails)

* Replace self-signed/expired certs with **CA-issued** certificates and correct SANs.
* Disable **TLS 1.0/1.1** and any weak ciphers in the proxy/load balancer/app config.
* Enable **TLS 1.2+** and AEAD suites; prefer TLS 1.3 where available.
* Add **HSTS** headers on HTTPS responses.

## Status

**Control ID:** TLS-CERT-CIPHERS

**Owner:** Platform Security

**Frequency:** Continuous monitoring; formal verification quarterly

(Evidence source: )
