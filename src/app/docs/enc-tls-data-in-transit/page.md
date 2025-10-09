---

title: "Encryption Tests — Data-in-Transit (TLS Enforcement)"
description: "Ensure all TPStorage client traffic is encrypted using TLS, and plain HTTP connections are blocked or redirected."
---
## Overview

TPStorage enforces **Transport Layer Security (TLS)** to protect data during transmission between clients and storage endpoints. All HTTP connections must either be **blocked** or **redirected to HTTPS**, ensuring credentials and object data are never transmitted in plaintext.

---

## Why This Matters

Unencrypted connections expose sensitive information to potential interception. Without enforced TLS:

* **Credentials** could be stolen via man-in-the-middle attacks.
* **Data integrity** could be compromised during transfer.
* **Compliance violations** could occur for security standards requiring encrypted communication.

Enforcing TLS ensures all data in transit remains secure and tamper-proof.

---

## Control Description

* All client requests must use **HTTPS endpoints** secured by TLS (v1.2 or higher).
* Any HTTP (non-TLS) requests must **fail** or be **redirected to HTTPS**.
* TLS certificates must be valid and trusted by clients.
* Enforcement applies to **PUT**, **GET**, **LIST**, and all other data operations.

---

## Testing Methodology

**Preconditions:**

* TPStorage endpoint supports HTTPS with a valid TLS certificate.
* `rclone` and `curl` installed for client testing.

**Tools Used:**

* `rclone` — S3-compatible client.
* `curl` — HTTP request testing tool.

**Steps Performed:**

1. **Attempt secure HTTPS operation:**

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/ --s3-endpoint https://<TPSTORAGE_HOST>
rclone ls rclone-remote:test-bucket/
```

2. **Attempt insecure HTTP operation:**

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/ --s3-endpoint http://<TPSTORAGE_HOST>
```

3. **Test endpoint with curl (HTTP):**

```bash
curl -I http://<TPSTORAGE_HOST>
```

---

## Expected Behavior

* **HTTPS requests** succeed normally.
* **HTTP requests** fail with `connection refused` or are redirected to HTTPS.
* No plaintext credentials or data are transmitted at any point.

---

## Actual Results

Testing confirmed that HTTPS connections function correctly and HTTP requests are rejected.

```bash
rclone copy /tmp/testfile.txt tpstorage_read_only:testing/ --s3-endpoint https://storage1.tpstreams.com --s3-no-check-bucket
rclone ls tpstorage_read_only:testing/ --s3-endpoint https://storage1.tpstreams.com --s3-no-check-bucket
        3 allowed-object.txt/allowed.txt
        5 testfile.txt
```

**Result:** ✅ Control Passed

---

## Notes / Remediation

* **If HTTP requests succeed**, disable non-TLS ports on the load balancer or web server.
* Ensure the endpoint enforces `Strict-Transport-Security (HSTS)` headers.
* Regularly test TLS enforcement using automated scanners or monitoring tools.
* Review TLS versions and ciphersuites to ensure compliance with security baselines.

---

## Status

* **Control ID:** ENC-DATA-TRANSIT-TLS
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07

---
