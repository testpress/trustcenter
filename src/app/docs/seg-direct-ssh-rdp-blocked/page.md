---
title: "Direct SSH/RDP Access Restriction"
description: "Ensure storage nodes are not directly reachable for administrative protocols (SSH/RDP) from public networks; management access must go through the bastion host or VPN."
---
Direct SSH/RDP to Storage Nodes Should Be Blocked Unless via Bastion/VPN

## Purpose
Ensure storage nodes are not directly reachable for administrative protocols (SSH/RDP) from public networks; management access must go through the bastion host or VPN.

## Pre-conditions

* List of storage node IPs/hostnames (private addresses)
* Bastion host hostname/IP and its public IP
* A test machine outside the private network (public Internet) and a test machine inside the private network (or with VPN connected)
* Authorization to run tests

## Tools

* `ssh` (Linux/macOS/WSL) with `-v` for verbose logs  
* `nc` or `telnet` for TCP connect checks  
* `rdesktop` or `xfreerdp` for RDP tests  
* Access to bastion/VPN to test permitted access  
* Access to storage node logs (`/var/log/auth.log` or `journalctl -u sshd`)

## Steps

### From external/public machine:

```bash
# SSH
ssh -v ubuntu@<STORAGE_NODE_IP>

# TCP connect
nc -vz <STORAGE_NODE_IP> 22

# RDP (if applicable)
nc -vz <STORAGE_NODE_IP> 3389
````

Expected: connection times out or is refused.

### From bastion host (authorized route):

```bash
ssh -J <BASTION_USER>@<BASTION_IP> ubuntu@<STORAGE_NODE_IP>
# or
ssh <BASTION_USER>@<BASTION_IP>
ssh ubuntu@<STORAGE_NODE_IP>
```

### From VPN client:

```bash
ssh ubuntu@<STORAGE_NODE_IP>
```

### Verify logs:

```bash
sudo journalctl -u sshd --since "5 minutes ago"
sudo tail -n 200 /var/log/auth.log
```

## Expected Result

* Direct public access: connection refused or timed out; no SSH/RDP login prompt.
* Bastion or VPN access: connection succeeds with login prompt.
* Logs show blocked/failed public attempts or proper source IP from bastion/VPN.

## Actual Result

✅ **Pass**