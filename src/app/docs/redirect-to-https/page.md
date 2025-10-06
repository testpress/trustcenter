---
title: "HTTP access should be blocked or redirect to HTTPS"
description: "Ensure plain HTTP connections to TPStorage endpoints are either redirected to HTTPS or blocked, protecting sensitive data from exposure."
---

# HTTP to HTTPS Redirection

## Overview

To protect data in transit, TPStorage enforces secure HTTPS connections for all endpoints. Any requests made over plain HTTP are either **redirected to HTTPS** or **explicitly blocked**. This ensures that sensitive data such as authentication tokens, credentials, and content metadata are never transmitted in plaintext.

---

## Why This Matters

Using unencrypted HTTP can expose users to serious security risks, including:

* **Credential leakage** through man-in-the-middle (MITM) attacks.
* **Session hijacking** by intercepting cookies or tokens over unencrypted channels.
* **Downgrade attacks**, where attackers force users onto insecure connections.

By strictly redirecting or blocking HTTP traffic, TPStorage ensures that all client interactions occur over TLS-encrypted channels, maintaining confidentiality and integrity.

---

## Control Description

* All TPStorage endpoints are configured to listen on HTTPS (port 443) with valid TLS certificates.
* Any HTTP requests (port 80) are either redirected to HTTPS using HTTP 301/302 or refused with HTTP 403.
* The `Strict-Transport-Security (HSTS)` header is set for all HTTPS responses, instructing browsers to always use HTTPS for subsequent requests.
* Plain HTTP traffic is never allowed to carry application data.

---

## Testing Methodology

**Preconditions:**

* Knowledge of the TPStorage endpoint hostname or IP address.
* Network access from a test client to the public endpoint.

**Tools Used:**

* `curl` command-line utility
* Standard web browsers

**Steps Performed:**

1. Send a plain HTTP request using curl and inspect response headers.
2. Observe whether the server redirects to HTTPS or blocks the request.
3. Verify that HTTPS access works correctly.
4. Confirm the presence of the HSTS header in HTTPS responses.

Example test command:

```bash
curl -v --max-redirs 0 http://storage1.tpstreams.com/
```

---

## Expected Behavior

* HTTP requests must **not** return sensitive data.
* The server should either:

  * Return a **301/302 redirect** pointing to the HTTPS endpoint, or
  * Return a **403 Forbidden** or refuse the connection.
* HTTPS endpoints must remain fully functional.
* HSTS headers must be present in HTTPS responses.

---

## Actual Results

Testing was performed on `storage1.tpstreams.com`.
The server responded to HTTP requests with **403 Forbidden** and included a valid `Strict-Transport-Security` header. HTTPS connections succeeded as expected.

```bash
curl -v --max-redirs 0 http://storage1.tpstreams.com/ 2>&1 | sed -n '1,200p'
```

Example output:
```bash
* Host storage1.tpstreams.com:80 was resolved.
* Connected to storage1.tpstreams.com (65.109.153.91) port 80
> GET / HTTP/1.1
> Host: storage1.tpstreams.com
...
< HTTP/1.1 403 Forbidden
< Server: nginx/1.18.0 (Ubuntu)
< Strict-Transport-Security: max-age=31536000; includeSubDomains
...
<Error><Code>AccessDenied</Code><Message>Access Denied.</Message></Error>
```

**Result:** 

✅ Control Passed

---

## Remediation (If Control Fails)

If HTTP is neither redirected nor blocked:

* Update load balancer or reverse proxy configuration to enforce HTTPS redirection.
* Add HSTS headers to strengthen HTTPS-only policies.
* Disable any legacy listeners serving plaintext HTTP traffic.

---

## Status

**Control ID:** NET-REDIRECT-HTTPS

**Status:** ✅ Implemented and Effective

**Last Verified:** 2025-10-06

---
