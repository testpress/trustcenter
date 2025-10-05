---
title: "Administrative Access via Bastion or VPN"
description: "Verify administrative workflows enforce use of the bastion host or VPN for node management and direct SSH is disallowed."
---
Administrative Access Must Require Jump Host or VPN

## Purpose
Verify administrative workflows enforce use of the bastion host (jump host) or VPN for node management and that direct administrative SSH is disallowed.

## Pre-conditions

* Documented admin access process (bastion host usage or VPN)  
* Admin user account and keys with permission to use bastion  
* Test machines both external and with VPN or bastion access

## Tools

* `ssh` with ProxyJump (`-J`) support  
* `sudo` and access to server logs (bastion and storage nodes)  
* VPN client  
* Bastion session recorder or audit logs

## Steps

### Attempt direct SSH from admin machine:

```bash
ssh admin@<STORAGE_NODE_IP>
````

### Attempt SSH via bastion:

```bash
ssh -J admin@<BASTION_IP> admin@<STORAGE_NODE_IP>
# or
ssh admin@<BASTION_IP>
ssh admin@<STORAGE_NODE_IP>
```

### Attempt via VPN:

```bash
# Connect VPN first
ssh admin@<STORAGE_NODE_IP>
```

### Validate logs:

```bash
sudo last -i | head
sudo journalctl -u sshd | tail -n 200
```

## Expected Result

* Direct SSH from admin host: blocked (timeout/refused).
* SSH via bastion/VPN: succeeds.
* Bastion logs show proxied session; storage logs show correct source IP.
* Auditable trail exists for approved access.

## Actual Result

✅ **Pass**