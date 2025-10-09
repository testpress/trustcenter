---

title: "Ping / Scan from Outside VPC Should Fail"
description: "Ensure TPStorage endpoints are not reachable from the public internet and are protected by firewall rules."
---
## Overview

TPStorage endpoints must be **isolated from the public Internet**. Any external ICMP (ping) or port scan attempts should be blocked or filtered, ensuring that only authorized internal networks can reach storage endpoints.

---

## Why This Matters

Exposure to the public Internet can lead to:

* **Unauthorized access attempts** to storage services.
* **Network reconnaissance** that could aid attackers.
* **Security compliance violations** if endpoints are exposed publicly.

Proper firewall and VPC controls are critical to prevent external access.

---

## Control Description

* TPStorage endpoints are protected by **firewall rules or VPC network policies**.
* External ICMP or TCP/UDP traffic must be **blocked or filtered**.
* Only authorized internal subnets should be able to communicate with storage endpoints.

---

## Testing Methodology

**Preconditions:**

* TPStorage hostname or public IP (if any).
* A test machine outside the VPC/subnet (e.g., external VM or office laptop).
* Authorization to perform external testing.

**Tools Used:**

* `ping` — ICMP reachability.
* `nmap` or `masscan` — TCP/UDP port scanning.
* `traceroute` / `tracepath` — path verification.

**Steps Performed:**

```bash
# Ping test
ping -c 4 <TPSTORAGE_HOST_OR_IP>

# TCP port scan (common ports)
nmap -Pn -p 22,80,443,9000,9001 <TPSTORAGE_HOST_OR_IP>

# Full top-100 ports
nmap -Pn --top-ports 100 <TPSTORAGE_HOST_OR_IP>

# Traceroute (if ICMP blocked)
traceroute <TPSTORAGE_HOST_OR_IP>

# Optional UDP scan
nmap -sU -p 123,161 <TPSTORAGE_HOST_OR_IP>
```

---

## Expected Behavior

* `ping` should **time out** or return “destination unreachable.”
* `nmap` must report ports as **filtered or closed**, not open.
* `traceroute` should stop at the firewall/VPC boundary.
* No services should be reachable from external/public networks.

---

## Actual Results

❌ **Fail**

* **ICMP (ping):** blocked (100% packet loss) ✅
* **TCP ports:** 80, 443, 9000, 9100 are reachable from external internet ❌
* **UDP ports:** 123, 161 are open|filtered (needs review) ❌

---

## Notes / Remediation

* Review firewall and security group rules to block external access.
* Restrict all TCP/UDP ports to authorized internal subnets only.
* Ensure ICMP is blocked from public networks.
* Re-test after remediation to confirm endpoints are not reachable externally.

---

## Status

* **Control ID:** NET-EXTERNAL-ACCESS
* **Status:** ❌ Remediation Required
* **Last Verified:** 2025-10-07

