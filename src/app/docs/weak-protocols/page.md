---

title: "Weak TLS protocols should be rejected (TLS 1.0 / TLS 1.1)"
description: "Ensure that legacy TLS versions are disabled and rejected by the server while modern TLS versions (TLS 1.2 and TLS 1.3) remain functional, maintaining secure communications."
---

## Overview

TPStorage enforces secure TLS protocols for all endpoints. Connections using **legacy TLS versions (1.0 and 1.1)** are explicitly rejected to prevent insecure communications, while **modern TLS versions (1.2 and 1.3)** remain fully supported. This prevents attackers from exploiting known weaknesses in older TLS versions.

---

## Why This Matters

Legacy TLS protocols are considered insecure and vulnerable to multiple attacks:

* **Protocol downgrade attacks** that force clients to use weaker encryption.
* **Cipher vulnerabilities**, allowing attackers to decrypt or tamper with traffic.
* **Compliance failures**, as many security standards (e.g., PCI-DSS, NIST) require TLS 1.2+ for secure communications.

Rejecting TLS 1.0/1.1 ensures all data in transit, including authentication tokens and sensitive metadata, remains encrypted with modern, secure protocols.

---

## Control Description

* All TPStorage endpoints are configured to **reject TLS 1.0 and TLS 1.1 connections**.
* Supported protocols include **TLS 1.2 and TLS 1.3** with secure cipher suites.
* Servers respond with handshake failures for unsupported legacy protocols, preventing any insecure connection from succeeding.
* Optional security tools such as `testssl.sh` or `nmap` can be used to verify protocol support and cipher configuration.

---

## Testing Methodology

**Preconditions:**

* Network access to the target HTTPS endpoint (`storage1.tpstreams.com`).

**Tools Used:**

* `openssl` command-line utility
* `testssl.sh` or `nmap` (optional)

**Steps Performed:**

1. Attempt to establish a connection using TLS 1.0:

```bash
openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com -tls1
```

2. Attempt to establish a connection using TLS 1.1:

```bash
openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com -tls1_1
```

3. Confirm that modern TLS versions are functional:

```bash
openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com -tls1_2
openssl s_client -connect storage1.tpstreams.com:443 -servername storage1.tpstreams.com -tls1_3
```

4. Optionally, run `testssl.sh storage1.tpstreams.com:443` to get a full compatibility matrix.

---

## Expected Behavior

* **TLS 1.0/1.1 connections must fail** with handshake errors or “no shared cipher” messages.
* **TLS 1.2/1.3 connections must succeed**, allowing normal secure communications.
* No sensitive data should be transmitted over insecure protocols.

---

## Actual Results

Testing performed on `storage1.tpstreams.com` showed:

* TLS 1.0 and TLS 1.1 connections returned handshake failures.
* TLS 1.2 and TLS 1.3 negotiated successfully.

Example `openssl` output:

```text
# TLS 1.0 attempt:
CONNECTED(00000003)
140735226813888:error:14094410:SSL routines:ssl3_read_bytes:sslv3 alert handshake failure:ssl/record/rec_layer_s3.c:1537:SSL alert number 40

# TLS 1.2 attempt:
CONNECTED(00000003)
...
---
```

**Result:** ✅ Control Passed

---

## Remediation (If Control Fails)

If legacy TLS versions are accepted:

* Update the web server or load balancer configuration to disable TLS 1.0 and 1.1.
* Ensure supported cipher suites are configured for TLS 1.2 and 1.3.
* Test using `openssl` or `testssl.sh` to confirm legacy protocols are rejected.

---

## Status

- **Control ID:** NET-TLS-WEAK
- **Status:** ✅ Implemented and Effective
- **Last Verified:** 2025-10-07
