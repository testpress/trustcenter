---

title: "MITM interception should be prevented (proxy testing)"
description: "Ensure HTTPS connections cannot be intercepted by unauthorized proxies and that clients properly detect untrusted certificates, with HSTS enforcing security."
---

## Overview

TPStorage must resist man‑in‑the‑middle (MITM) interception attempts. HTTPS connections should fail when an unauthorized intermediary (proxy) attempts to present an untrusted certificate. Where appropriate, HSTS should be present to reduce downgrade risk and ensure browsers always use HTTPS.

---

## Why This Matters

MITM interception undermines the confidentiality and integrity of data in transit. Successful interception or improper trust of intermediary certificates can lead to:

* **Credential theft** (captured login forms, tokens, cookies).
* **Data exposure** (downloaded/uploaded content and metadata).
* **Undetected tampering** of responses sent to clients.
* **Increased downgrade risk** if HSTS is not enforced.

Preventing interception and ensuring clients detect untrusted CAs are critical to protect users and meet compliance requirements.

---

## Control Description

* Clients must reject HTTPS connections that present certificates signed by untrusted or unauthorized CAs (including interception proxies).
* TPStorage must present valid certificates from trusted public CAs for production endpoints.
* HSTS (`Strict-Transport-Security`) must be present on HTTPS responses to reduce downgrade attacks.
* MITM testing should only be performed in authorized test environments (isolated VMs/labs); never install test CAs on production clients.

---

## Testing Methodology

**Preconditions:**

* An isolated test environment (test VM or lab) where you can safely run interception proxies.
* Network access from the test client to `storage1.tpstreams.com`.
* Authorization to perform MITM tests on the target systems.

**Tools Used:**

* `mitmproxy` or Burp Suite (interception).
* Browser or `curl` configured to use a proxy.
* (Optional) A disposable test VM for installing a proxy CA for controlled simulation.

**Steps Performed:**

1. **Baseline (no proxy)** — verify normal HTTPS access:

```bash
curl -I https://storage1.tpstreams.com/ 2>&1 | sed -n '1,200p'
```

2. **Attempt interception without trusting proxy CA (safe test)**

   * Start mitmproxy (default listens on 8080):

```bash
mitmproxy --mode regular --listen-port 8080
```

* Configure the browser or `curl` to use the proxy but **do not** install mitmproxy’s CA cert in the client/system. For `curl`:

```bash
curl -x http://127.0.0.1:8080 https://storage1.tpstreams.com/ -v
```

* Expected behavior: Browser shows a certificate error/warning (untrusted issuer). `curl` shows an SSL/TLS verification error such as:


SSL certificate problem: unable to get local issuer certificate

3. **(Optional) Interception with trusted proxy CA — controlled simulation only**

   * In an isolated test VM only, install mitmproxy CA into the trust store and repeat the request through the proxy to demonstrate that interception becomes possible when a CA is trusted (this is a controlled demonstration — do not do on production devices).

4. **Check HSTS header:**

```bash
curl -I https://storage1.tpstreams.com/ | grep -i Strict-Transport-Security || true
```

---

## Expected Results

* **Without proxy CA trusted by the client:**

  * Browsers must display certificate warnings and refuse to load sensitive content.
  * `curl` must fail TLS verification unless explicitly told to ignore it (`-k`/`--insecure`).
* **With proxy CA trusted (test VM only):**

  * Interception will succeed in the test VM — demonstrates the importance of protecting trust stores.
* **HSTS header** must be present on HTTPS responses to reduce the risk of downgrade attacks.

---

## Actual Results

Testing performed against `storage1.tpstreams.com` produced the following:

| Test                        | Expected Result                  | Actual Result                                                                       | Status |
| --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- | ------ |
| HTTPS baseline              | TLS handshake succeeds           | TLS handshake succeeds (normal HTTPS response)                                      | PASS   |
| MITM proxy (CA not trusted) | Connection rejected / cert error | `curl` fails with `SSL certificate problem: unable to get local issuer certificate` | PASS   |
| HSTS header                 | Present                          | Verified: `Strict-Transport-Security: max-age=31536000; includeSubDomains`          | PASS   |

**Result:** ✅ Control Passed

**Example outputs used during verification:**

Baseline HTTPS header check:

```bash
curl -I https://storage1.tpstreams.com/ 2>&1 | sed -n '1,200p'
```

Intercept attempt (untrusted proxy):

```bash
curl -x http://127.0.0.1:8080 https://storage1.tpstreams.com/ -v
# => * SSL certificate problem: unable to get local issuer certificate
```

HSTS check:

```bash
curl -I https://storage1.tpstreams.com/ | grep -i Strict-Transport-Security
# => Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Notes / Remediation

* **Do not install test CA certificates on production or user machines.** Limit interception tests to disposable or isolated VMs.
* If clients accept an interception CA unexpectedly, **audit client trust stores** and remove unauthorized roots immediately.
* Ensure production endpoints use certificates from trusted public CAs and that certificate chains are configured correctly.
* Enforce `Strict-Transport-Security` with a suitable `max-age` and `includeSubDomains` where appropriate. Consider `preload` only after careful vetting.
* If interception succeeds on production clients without a trusted CA, investigate for client compromise or improper trust store configuration immediately.

---

## Status

- **Control ID:** NET-MITM-PROXY
- **Status:** ✅ Implemented and Effective
- **Last Verified:** 2025-10-07

