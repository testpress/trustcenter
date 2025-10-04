---
title: "MITM interception should be prevented (proxy testing)"
description: "Ensure HTTPS connections cannot be intercepted by unauthorized proxies and that clients properly detect untrusted certificates, with HSTS enforcing security."
---

MITM interception should be prevented (proxy testing)

## Purpose
Confirm HTTPS prevents interception and that clients/browsers warn when presented with an untrusted intermediary certificate. Also verify HSTS is present to reduce downgrade risk.

## Pre-conditions

* Test environment where you can safely run an interception proxy (dedicated test VM or lab).
* TPStorage is reachable from the test client.
* You must only perform MITM testing on systems you own or are explicitly authorized to test.

## Tools

* `mitmproxy` or Burp Suite (interception)
* Browser or `curl` configured to use a proxy
* (Optional) Access to a test VM's certificate store for controlled simulation — **do not install untrusted CA certs on production clients.**

## Steps

1. **Baseline (no proxy)**

   ```bash
   curl -I https://<HOST>/ 2>&1 | sed -n '1,200p'
   ```

2. **Attempt interception without trusting proxy CA (safe test)**

   * Start mitmproxy (default listens on 8080):

   ```bash
   mitmproxy --mode regular --listen-port 8080
   ```

   * Configure browser or `curl` to use the proxy but **do not** install mitmproxy’s CA cert into the browser/system. For `curl`:

   ```bash
   curl -x http://127.0.0.1:8080 https://<HOST>/ -v
   ```

   * Try to visit the HTTPS site:
     * **Expected:** Browser shows an HTTPS certificate error/warning (untrusted issuer). `curl` shows an SSL/TLS verification error (e.g., `SSL certificate problem: unable to get local issuer certificate`).

3. **(Optional) Interception with trusted proxy CA — controlled simulation only**

   * In a disposable test VM, install mitmproxy CA into the trust store, then repeat the request through the proxy to demonstrate interception (test VM only).

4. **Check HSTS header** (see TLS checks):

```bash
curl -I https://<HOST>/ | grep -i Strict-Transport-Security || true
```

## Expected Result:

* With proxy CA **not trusted** by the client:
  * Browser displays a certificate error and refuses to load content.
  * `curl` fails TLS verification unless `-k`/`--insecure` is used.
* With proxy CA **trusted** (test VM only), interception will succeed — demonstrates importance of protecting client root stores.
* HSTS header present reduces the risk of downgrade attacks.

## Actual Result:
✅ **Pass**

| Test                        | Expected Result                  | Actual Result                                                                                | Status |
| --------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| HTTPS baseline              | TLS handshake succeeds           | TLS handshake succeeds (`400 Bad Request` not critical)                                      | PASS   |
| MITM proxy (CA not trusted) | Connection rejected / cert error | curl fails with `SSL certificate problem: unable to get local issuer certificate`            | PASS   |
| HSTS header                 | Present                          | Verified (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)                  | PASS   |

## Notes / Remediation

* Never install untrusted CA certificates on production or user machines. Limit testing to isolated VMs.
* If clients accept the proxy CA unexpectedly, audit client trust stores and remove unauthorized root certs.
* Ensure `Strict-Transport-Security` is set with an appropriate `max-age` and `includeSubDomains` as needed to reduce downgrade risk.
* If interception succeeds on production clients without a trusted CA, investigate client compromise or improper trust store configuration immediately.
