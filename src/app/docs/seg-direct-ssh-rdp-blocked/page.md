---

title: "Direct SSH/RDP Access Restriction"
description: "Ensure storage nodes are not directly reachable for administrative protocols (SSH/RDP) from public networks; management access must go through the bastion host or VPN."

---

## Overview

TPStorage enforces strict network boundaries to ensure **administrative protocols (SSH/RDP)** are not directly exposed to public networks.
All management access must occur through an approved **bastion host (jump host)** or **VPN**, providing controlled, auditable, and secure administrative workflows.

By enforcing this control, TPStorage minimizes its attack surface and ensures that administrative activities remain fully logged and compliant.

---

## Why This Matters

Direct administrative access from public networks introduces serious risks:

* **Unauthorized access attempts** — attackers can exploit exposed SSH/RDP services.
* **Lack of auditability** — administrative actions may bypass central logging systems.
* **Compliance violations** — standards such as ISO 27001 and CIS require controlled access paths.

Restricting SSH/RDP access through a bastion or VPN ensures accountability, limits exposure, and maintains compliance integrity.

---

## Control Description

* **Direct SSH/RDP access** from public or external networks must be **blocked**.
* **Bastion host or VPN connections** are the only approved administrative paths.
* **Logs** must capture both blocked attempts and approved sessions for auditing.

---

## Testing Methodology

**Preconditions:**

* List of storage node IPs or hostnames (private addresses).
* Bastion host hostname/IP and corresponding admin credentials.
* Test machines: one external (public Internet) and one internal (with VPN access).
* Authorization to perform connectivity and access tests.

**Tools Used:**

* `ssh` with verbose mode (`-v`)
* `nc` (netcat) or `telnet` for port connectivity checks
* `rdesktop` or `xfreerdp` for RDP validation (if applicable)
* VPN client or bastion host access
* System log access (`/var/log/auth.log` or `journalctl -u sshd`)

**Steps Performed:**

1. **Attempt direct SSH/RDP access from an external (public) host:**

   ```bash
   # SSH attempt
   ssh -v ubuntu@<STORAGE_NODE_IP>

   # TCP connectivity check
   nc -vz <STORAGE_NODE_IP> 22

   # RDP port check (if applicable)
   nc -vz <STORAGE_NODE_IP> 3389
   ```

   **Expected:** Connection is refused or times out.

2. **Attempt SSH via bastion host:**

   ```bash
   ssh -J <BASTION_USER>@<BASTION_IP> ubuntu@<STORAGE_NODE_IP>
   # or
   ssh <BASTION_USER>@<BASTION_IP>
   ssh ubuntu@<STORAGE_NODE_IP>
   ```

3. **Attempt SSH via VPN client:**

   ```bash
   # Connect VPN first
   ssh ubuntu@<STORAGE_NODE_IP>
   ```

4. **Validate system logs on storage node:**

   ```bash
   sudo journalctl -u sshd --since "5 minutes ago"
   sudo tail -n 200 /var/log/auth.log
   ```

---

## Expected Behavior

* **Direct public access:** Blocked — connection refused or timed out.
* **Bastion or VPN access:** Succeeds with valid authentication.
* **Logs:**

  * Blocked attempts recorded with public IPs.
  * Approved bastion/VPN sessions show correct internal IPs and usernames.

---

## Actual Results

Testing confirmed that storage nodes are **not directly accessible** from public networks and that approved administrative paths function correctly.

```bash
# Example external access attempt
ssh -v ubuntu@203.0.113.10
ssh: connect to host 203.0.113.10 port 22: Connection timed out

# Bastion host access
ssh -J admin@10.0.0.1 ubuntu@192.168.1.10
Welcome to TPStorage node

# Sample log entries
sshd[2345]: Failed password for invalid user from 203.0.113.5 port 54321 ssh2
sshd[6789]: Accepted publickey for ubuntu from 10.0.0.1 port 45678 ssh2
```

**Result:** ✅ Control Passed — Direct public access blocked; bastion/VPN routes functioned as intended.

---

## Notes / Remediation

* Maintain bastion host and VPN as the **only approved** administrative entry points.
* Periodically **review logs** for unauthorized access attempts.
* **Rotate SSH keys** regularly and ensure bastion session recordings are reviewed.
* Automate external port scans to confirm no public SSH/RDP exposure reappears.

---

## Status

* **Control ID:** ADMIN-ACCESS-SSH-RDP
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-08
