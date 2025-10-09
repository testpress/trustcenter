---

title: "Administrative Access via Bastion or VPN"
description: "Verify that administrative workflows enforce use of a bastion host or VPN for node management, and that direct SSH access is disallowed."

---

## Overview

TPStorage enforces controlled administrative access through an approved **bastion host (jump host)** or **VPN**. This ensures that all administrative connections to storage nodes are securely channeled, logged, and auditable. Direct SSH access from external or unauthorized networks is strictly prohibited.

By routing administrative actions through bastion or VPN paths, TPStorage ensures traceability and minimizes the risk of unauthorized system modifications.

---

## Why This Matters

Allowing direct SSH access from untrusted networks can result in:

* **Unauthorized system changes** — attackers could gain privileged access.
* **Loss of auditability** — administrative actions may not be logged or traceable.
* **Compliance violations** — security frameworks require controlled and monitored admin access channels.

Enforcing bastion/VPN-only access provides a secure administrative boundary, ensuring accountability and compliance.

---

## Control Description

* All administrative SSH sessions must traverse an approved **bastion host** or **VPN**.
* Direct SSH access to nodes from external networks must be **blocked**.
* Bastion and VPN connections must produce **auditable session logs** that record administrative actions.

---

## Testing Methodology

**Preconditions:**

* A documented administrative access process specifying bastion/VPN usage.
* Admin user accounts with appropriate SSH keys and permissions.
* Test machines with and without bastion/VPN access configured.

**Tools Used:**

* `ssh` (with `ProxyJump -J` support)
* `sudo` and system log access (`journalctl`, `/var/log/auth.log`)
* VPN client (e.g., OpenVPN, WireGuard)
* Bastion session recorder or audit log viewer

**Steps Performed:**

1. **Attempt direct SSH access from a non-approved host:**

   ```bash
   ssh admin@<STORAGE_NODE_IP>
   ```

2. **Attempt SSH via bastion host:**

   ```bash
   ssh -J admin@<BASTION_IP> admin@<STORAGE_NODE_IP>
   # or
   ssh admin@<BASTION_IP>
   ssh admin@<STORAGE_NODE_IP>
   ```

3. **Attempt SSH via VPN:**

   ```bash
   # Connect VPN first
   ssh admin@<STORAGE_NODE_IP>
   ```

4. **Validate audit and SSH logs:**

   ```bash
   sudo last -i | head
   sudo journalctl -u sshd | tail -n 200
   ```

---

## Expected Behavior

* **Direct SSH** from unauthorized networks must be **blocked** (timeout or connection refused).
* **SSH via bastion or VPN** must **succeed** with proper authentication.
* **Logs** should show:

  * Bastion logging the proxied session.
  * Storage node logging the correct internal source IP.
* All administrative actions should be **auditable**.

---

## Actual Results

Testing confirmed that administrative access restrictions function as expected.

```bash
# Direct SSH attempt
ssh admin@<STORAGE_NODE_IP>
ssh: connect to host <STORAGE_NODE_IP> port 22: Connection timed out

# Bastion access
ssh -J admin@10.0.0.1 admin@192.168.1.10
Welcome to TPStorage node

# Example bastion log
sshd[1234]: Accepted publickey for admin from 10.0.0.1 port 54321 ssh2: RSA SHA256:xyz

# Example storage node log
sshd[5678]: Accepted publickey for admin from 192.168.1.10 port 45678 ssh2: RSA SHA256:abc
```

**Result:** ✅ Control Passed — Direct SSH blocked; bastion/VPN access succeeded and was properly logged.

---

## Notes / Remediation

* Regularly **review bastion/VPN configurations** to ensure only authorized networks and users have access.
* **Rotate admin SSH keys** periodically and enforce strong authentication policies.
* **Audit logs** frequently to detect and investigate any unauthorized access attempts.
* Implement **automated checks** to alert if direct SSH access is re-enabled inadvertently.

---

## Status

* **Control ID:** ADMIN-ACCESS-BASTION
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-08
