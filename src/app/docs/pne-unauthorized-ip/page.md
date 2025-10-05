---
title: "Connection from Unauthorized IP Should Be Blocked"
description: "Verify firewall or security groups enforce IP allowlist restrictions, blocking unauthorized IPs."
---
Connection from Unauthorized IP Should Be Blocked

## Purpose
Verify the firewall or security groups enforce allowlist by IP — unauthorized IPs must be denied.

## Pre-conditions

* TPStorage endpoint and port list (e.g., 443, 9000).
* A test machine whose IP is not in the allowlist (external).
* Access to firewall / security group logs (or admin who can fetch them).

## Tools

* `curl`, `telnet`, `nc` (netcat)
* `nmap` (optional)
* Access to firewall/security group console/logs (e.g., AWS Security Groups, on-prem firewall)

## Steps

```bash
# TCP connect test
nc -vz <TPSTORAGE_HOST_OR_IP> 443
nc -vz <TPSTORAGE_HOST_OR_IP> 9000

# Or telnet
telnet <TPSTORAGE_HOST_OR_IP> 443

# HTTP HEAD request
curl -I --connect-timeout 10 https://<TPSTORAGE_HOST_OR_IP>/
```

Check firewall or security group logs for DENY or DROP entries matching the source IP and destination port.

Example (AWS VPC Flow Logs): look for ACCEPT/DENY records for the source IP and port/time.

## Expected Result

* `nc` / `telnet` attempts should fail (Connection timed out or refused).
* `curl` must time out or show connection refused (no HTTP/HTTPS response).
* Firewall logs should show the connection attempt blocked for the unauthorized IP.

## Actual Result
✅ **Pass**

```bash
curl -I --connect-timeout 10 https://storage1.tpstreams.com
curl: (28) Connection timeout after 10001 ms
```
