---

title: "Connection from Unauthorized IP Should Be Blocked"
description: "Verify firewall or security groups enforce IP allowlist restrictions, blocking unauthorized IPs."
---
## Overview

TPStorage endpoints must enforce **IP allowlists** to prevent unauthorized access. Any connection attempt from an IP not on the allowlist must be blocked at the firewall or security group level.

---

## Why This Matters

Without proper IP allowlist enforcement:

* **Unauthorized systems** could connect to storage endpoints.
* **Potential data exfiltration** or system compromise.
* **Security and compliance violations** may occur.

Validating IP restrictions ensures that only approved clients can communicate with TPStorage.

---

## Control Description

* Firewalls or security groups enforce allowlist rules by IP/subnet.
* Connection attempts from unauthorized IPs must be **denied or dropped**.
* Enforcement applies to all exposed storage ports (e.g., 443, 9000).

---

## Testing Methodology

**Preconditions:**

* TPStorage endpoint and relevant port list (e.g., 443, 9000).
* A test machine with an **unauthorized IP** (external source).
* Access to firewall/security group logs or an admin who can retrieve them.

**Tools Used:**

* `curl`, `telnet`, `nc` (netcat) — connectivity tests.
* `nmap` (optional) — port scanning.
* Firewall/security group logs — for verification (AWS Security Groups, on-prem firewall, etc.).

**Steps Performed:**

```bash
# TCP connect test
nc -vz <TPSTORAGE_HOST_OR_IP> 443
nc -vz <TPSTORAGE_HOST_OR_IP> 9000

# Or using telnet
telnet <TPSTORAGE_HOST_OR_IP> 443

# HTTP HEAD request
curl -I --connect-timeout 10 https://<TPSTORAGE_HOST_OR_IP>/
```

*Check firewall or security group logs for DENY or DROP entries matching the source IP, destination port, and timestamp.*

---

## Expected Behavior

* `nc` / `telnet` attempts **fail** (connection timed out or refused).
* `curl` must **timeout** or show connection refused — no HTTP/HTTPS response.
* Firewall/security group logs should indicate the connection attempt was **blocked** for the unauthorized IP.

---

## Actual Results

✅ **Pass**

```bash
curl -I --connect-timeout 10 https://storage1.tpstreams.com
curl: (28) Connection timeout after 10001 ms
```

---

## Notes / Remediation

* **If unauthorized connections succeed**, review firewall and security group rules immediately.
* Regularly audit allowlists to ensure only intended IPs have access.
* Re-test from multiple unauthorized sources to confirm enforcement.

---

## Status

* **Control ID:** NET-UNAUTHORIZED-IP-BLOCK
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07
