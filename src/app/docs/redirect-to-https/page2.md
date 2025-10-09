---

title: "TLS Tests — Certificate Validation, Protocols, and MITM Resistance"
description: "Verify TLS certificate details, enforce modern TLS (1.2+), reject weak protocols, and prevent MITM interception for TPStorage endpoints."
---
## Overview

Ensure TPStorage endpoints enforce strong TLS configuration: valid certificates, modern TLS versions and ciphers, and resistance to man-in-the-middle (MITM) interception. This test document groups three related test cases:

* **TLS-02** — Certificate details and strong cipher suites
* **TLS-03** — Weak TLS protocols should be rejected (TLS 1.0 / 1.1)
* **TLS-04** — MITM interception should be prevented (proxy testing)

---

## Why This Matters

Poor TLS configuration or trust store issues can lead to:

* **Credential or data exposure** via downgraded or intercepted TLS.
* **Man-in-the-middle attacks** if clients accept untrusted intermediaries.
* **Non-compliance** with security baselines requiring TLS 1.2+/strong ciphers and HSTS.

Validating certificates, supported protocol versions, cipher suites, and MITM resistance ensures secure transport of data and reduces the attack surface.

---

## Control Description

* TLS certificates must be valid (trusted issuer, correct subject/SANs, current validity period).
* Server must support TLS 1.2 and TLS 1.3 only; older insecure protocols (TLS 1.0, 1.1, SSLv3) must be disabled.
* Only strong, AEAD/ECDHE ciphersuites should be offered. No RC4/DES/export ciphers.
* HSTS header should be present to reduce downgrade risk.
* Clients should show certificate errors when an untrusted proxy CA attempts interception.

---

## Testing Methodology (Common Preconditions & Tools)

**Preconditions**

* HTTPS endpoint reachable (port 443 or configured HTTPS port).
* Authorization to perform tests, especially interception tests (TLS-04) — run only on systems you own or are permitted to test.

**Tools**

* `openssl` (`s_client`, `x509`)
* `nmap` with `--script ssl-enum-ciphers` (optional)
* `curl`
* `testssl.sh` or `nmap` (optional)
* `mitmproxy` or Burp Suite (for controlled MITM testing)
* Browser certificate viewer (optional)

---

## TLS-02 — Verify TLS certificate details and strong cipher suites

**Purpose:**
Confirm certificate validity (issuer, subject, expiry) and that the server only supports modern TLS (1.2+) and strong ciphers.

**Steps / Commands**

```bash
# Inspect certificate (issuer, validity dates, SANs)
echo | openssl s_client -connect <HOST>:443 -servername <HOST> 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates -ext subjectAltName

# View full certificate chain
openssl s_client -connect <HOST>:443 -servername <HOST> -showcerts

# Check supported TLS versions and ciphers (optional; may take time)
nmap --script ssl-enum-ciphers -p 443 <HOST>

# Check for HSTS header (optional)
curl -I https://<HOST>/ | grep -i Strict-Transport-Security || true
```

**Expected Result**

* Certificate issued by a trusted CA (public CA or internal trusted CA).
* `Not Before` / `Not After` show certificate is currently valid.
* Subject / SAN includes hostname used by clients.
* TLS 1.2 and TLS 1.3 supported; TLS 1.0/1.1 absent.
* Only strong ciphers (AEAD, ECDHE) offered.
* HSTS header present (recommended).

**Actual Result:** ✅ **Pass**

*Example: SSL Labs Report available for domain.*
`https://www.ssllabs.com/ssltest/analyze.html?d=storage1.tpstreams.com`

---

## TLS-03 — Weak TLS protocols should be rejected (TLS 1.0 / TLS 1.1)

**Purpose:**
Verify the server rejects old and insecure TLS versions (TLS 1.0 and 1.1).

**Steps / Commands**

```bash
# Test TLS 1.0
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1 2>&1 | sed -n '1,200p'

# Test TLS 1.1
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_1 2>&1 | sed -n '1,200p'

# Test TLS 1.2 and TLS 1.3 to confirm modern versions work
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_2 2>&1 | sed -n '1,200p'
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_3 2>&1 | sed -n '1,200p'

# Optional: Use testssl.sh for a full compatibility matrix
./testssl.sh <HOST>:443
```

**Expected Result**

* `-tls1` and `-tls1_1` attempts **fail** to negotiate (handshake failure / no shared cipher).
* `-tls1_2` and `-tls1_3` succeed if client supports them.
* No successful connection with TLS 1.0/1.1.

**Actual Result:** ✅ Pass

*Screenshots or test outputs demonstrate TLS 1.0/1.1 rejection and TLS 1.2/1.3 success.*

---

## TLS-04 — MITM interception should be prevented (proxy testing)

**Purpose:**
Confirm HTTPS prevents interception and that clients warn on untrusted intermediary certificates. Verify HSTS presence to reduce downgrade risk.

**Pre-conditions / Safety**
Perform MITM only on systems you own or have explicit permission to test. Use isolated test VMs for any CA trust-store changes.

**Tools**

* `mitmproxy` or Burp Suite
* Browser or `curl` configured to use proxy

**Steps**

1. **Baseline (no proxy)**

```bash
curl -I https://<HOST>/ 2>&1 | sed -n '1,200p'
```

2. **Attempt interception without trusting proxy CA**

* Start mitmproxy:

```bash
mitmproxy --mode regular --listen-port 8080
```

* Configure client to use proxy (do **not** install mitmproxy CA). For example:

```bash
curl -x http://127.0.0.1:8080 https://<HOST>/ -v
```

**Expected:** Browser shows certificate error; `curl` shows TLS verification error (e.g., "unable to get local issuer certificate").

3. **Optional: Interception with trusted proxy CA (controlled lab)**
   Install mitmproxy CA only in an isolated test VM to simulate a trusted intermediary — this demonstrates why protecting trust stores is critical.

4. **Check HSTS header**

```bash
curl -I https://<HOST>/ | grep -i Strict-Transport-Security || true
```

**Expected Result**

* With proxy CA **not trusted**: browser shows certificate error; `curl` fails TLS verification unless `-k` used.
* With proxy CA **trusted** in a disposable VM: interception succeeds (lab-only).
* HSTS header present to reduce downgrade risk.

**Actual Result:** ✅ Pass

*Example test matrix:*

| Test                        | Expected Result                  | Actual Result                                                                   | Status |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------------- | ------ |
| HTTPS baseline              | TLS handshake succeeds           | TLS handshake succeeds (`200/normal response`)                                  | PASS   |
| MITM proxy (CA not trusted) | Connection rejected / cert error | `curl` fails: `SSL certificate problem: unable to get local issuer certificate` | PASS   |
| HSTS header                 | Present                          | `Strict-Transport-Security: max-age=31536000; includeSubDomains`                | PASS   |

---

## Notes / Remediation

* Disable TLS 1.0/1.1 and non-AEAD weak ciphers on load balancers / servers.
* Ensure TLS certificates are issued by trusted CAs and are rotated before expiry.
* Enforce `Strict-Transport-Security` with an appropriate `max-age` and `includeSubDomains` when applicable.
* Do not install untrusted CAs on production clients; use isolated VMs for any trusted-proxy simulations.
* Regularly scan endpoints (e.g., testssl.sh, SSL Labs) to detect regressions.

---

## Status

* **Control ID(s):** TLS-CERT-CIPHERS (TLS-02), TLS-WEAK-PROTOCOLS (TLS-03), TLS-MITM (TLS-04)
* **Overall Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07
