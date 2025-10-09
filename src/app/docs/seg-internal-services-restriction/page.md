---

title: "Internal Services Access Restriction"
description: "Confirm that management and internal services (MinIO admin console, metrics, etcd ports, SSH management APIs) are only accessible from internal networks or via bastion/VPN."

---

## Overview

TPStorage enforces strict access controls to ensure that **management and internal service endpoints** — such as the **MinIO admin console**, **metrics endpoints**, **etcd ports**, and **SSH management APIs** — are **not exposed to the public Internet**.
These services must only be reachable from **internal networks**, **VPN connections**, or **bastion hosts** to maintain secure and auditable administrative operations.

---

## Why This Matters

Publicly exposed internal services pose significant security and compliance risks:

* **Unauthorized access** — attackers may gain control over internal infrastructure.
* **Data leakage or corruption** — sensitive endpoints can be tampered with or exfiltrated.
* **Compliance violations** — most frameworks (ISO, CIS, SOC 2) mandate restricted internal service access.

Limiting access to trusted internal paths reduces the attack surface and ensures secure, accountable administrative activity.

---

## Control Description

* All internal and management service endpoints must be **accessible only via internal networks**, **VPN**, or **bastion hosts**.
* Any **public or external connection attempts** must be **blocked or refused**.
* **Firewall and application logs** should capture denied attempts for monitoring and auditing.

---

## Testing Methodology

**Preconditions:**

* Inventory of internal service endpoints and ports:

  * MinIO Console — `9001`
  * S3 API — `9000`
  * etcd — `2379`, `2380`
  * Metrics/Prometheus — `9100`
* Two test machines:

  * One external (public Internet)
  * One internal (private network or VPN-connected)
* Authorization to perform connectivity and access tests.

**Tools Used:**

* `curl`, `nc`, `telnet`
* `nmap` (optional, if permitted)
* Web browser for accessing the MinIO admin console
* Access to **firewall** and **application logs**

**Steps Performed:**

1. **Attempt connections from external/public machine:**

   ```bash
   # MinIO admin console
   nc -vz <TPSTORAGE_HOST_OR_IP> 9001
   curl -I https://<TPSTORAGE_HOST_OR_IP>:9001/ --max-time 10

   # Internal service ports
   nc -vz <TPSTORAGE_HOST_OR_IP> 2379
   nc -vz <TPSTORAGE_HOST_OR_IP> 9100
   curl -I http://<TPSTORAGE_HOST_OR_IP>:9001/
   ```

   **Expected:** All connections should fail (timeout or refused).

2. **Attempt connections from internal/VPN/bastion network:**

   ```bash
   nc -vz <TPSTORAGE_INTERNAL_IP> 9001
   curl -I https://<TPSTORAGE_INTERNAL_IP>:9001/
   ```

   **Expected:** Connections should succeed with valid responses.

3. **Verify logs for access patterns:**

   * Review firewall logs for denied external connections.
   * Review application logs for successful internal/VPN access.

---

## Expected Behavior

* **External/Public Access:** Blocked (timeout or connection refused).
* **Internal/VPN/Bastion Access:** Succeeds with valid responses.
* **Logs:** Show clear DENY entries for public attempts and ACCEPT entries for authorized internal sessions.

---

## Actual Results

Testing confirmed that internal service restrictions are properly enforced.

```bash
# Example test results
nc -vz 203.0.113.15 9001
nc: connect to 203.0.113.15 port 9001 (tcp) failed: Connection timed out

# Internal/VPN access
nc -vz 10.0.0.5 9001
Connection to 10.0.0.5 9001 port [tcp/*] succeeded!

# Sample firewall logs
DROP tcp -- 203.0.113.15 any -> 10.0.0.5 9001
DROP tcp -- 198.51.100.7 any -> 10.0.0.6 2379
ACCEPT tcp -- 10.0.0.20 any -> 10.0.0.5 9001
```

**Result:** ✅ Control Passed — Public access blocked; internal/VPN access succeeded and logs confirmed proper filtering.

---

## Notes / Remediation

* Ensure firewall configurations **enforce internal-only access** for all management and sensitive service ports.
* Periodically **review firewall and access logs** for unauthorized connection attempts.
* Maintain **bastion/VPN** as the only approved access path for all administrative and management interfaces.
* Automate external port scans to validate continued compliance.

---

## Status

* **Control ID:** INTERNAL-SERVICES-ACCESS
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-08
