---

title: "Verify Allowed IPs / Subnets Can Access TPStorage"
description: "Confirm systems from allowlisted IPs/subnets can reach TPStorage endpoints successfully, ensuring proper access control while blocking unauthorized sources."
---
## Overview

TPStorage enforces **network-level access control** to allow only approved IP addresses or subnets to connect. This ensures that only authorized systems can reach storage endpoints, protecting against unauthorized access.

---

## Why This Matters

Without proper IP/subnet allowlisting:

* **Unauthorized systems** could access storage endpoints.
* **Data breaches** or exfiltration could occur.
* **Compliance violations** may result if network restrictions are required.

Verifying allowed IPs ensures only authorized sources can reach TPStorage endpoints.

---

## Control Description

* TPStorage endpoints are configured to allow traffic **only from specific IP addresses or subnets**.
* Connection attempts from non-allowlisted sources must be blocked.
* Enforcement applies at the **firewall, load balancer, or VPC security group** level.

---

## Testing Methodology

**Preconditions:**

* A test machine exists inside the allowed subnet/VPC (or with an allowed source IP).
* TPStorage endpoint and credentials (if performing authenticated operations).
* Knowledge of the exact allowlist (IP/CIDR) configured in firewall or security groups.

**Tools Used:**

* `curl`, `nc`, `aws` CLI, `mc` (MinIO client) for connectivity and functional tests.
* `s3cmd` or `aws s3` for S3-compatible operations (if configured).

**Steps Performed — A. Connectivity Checks (Basic):**

```bash
# From an allowed-IP machine, test TCP connect
nc -vz <TPSTORAGE_HOST_OR_IP> 443
nc -vz <TPSTORAGE_HOST_OR_IP> 9000

# Test HTTP HEAD request
curl -I https://<TPSTORAGE_HOST_OR_IP>/
```

---

## Expected Behavior

* `nc` and `curl` should **succeed**, showing open/connectable status.
* Firewall or security group logs must show **ALLOW** for the test IP/CIDR.
* Any connection from a non-allowlisted source should be **blocked**.

---

## Actual Results

✅ **Pass**

*Connections from allowed IPs succeeded, confirming correct allowlist enforcement.*

---

## Notes / Remediation

* **If allowed-IP tests fail**, check firewall rules, load balancer, and security group configurations.
* Regularly audit IP/subnet allowlists to ensure only intended sources have access.
* Test from multiple authorized and unauthorized sources to verify proper enforcement.

---

## Status

* **Control ID:** NET-ALLOWLIST-ACCESS
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07
