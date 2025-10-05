---
title: "Internal Services Access Restriction"
description: "Confirm management and internal services (MinIO admin console, metrics, etcd ports, SSH management APIs) are only accessible from internal networks or via bastion/VPN."
---
Internal Services Should Not Be Accessible From Public Network

## Purpose
Confirm management and internal services are only accessible from internal networks or via bastion/VPN.

## Pre-conditions

* List of internal service endpoints/ports (e.g., MinIO console 9001, S3 9000, etcd 2379/2380, Prometheus 9100)  
* Test machine in public network and test machine in internal network/VPN

## Tools

* `curl`, `nc`, `telnet`  
* `nmap` (if permitted)  
* Browser for MinIO console  
* Access to firewall and application logs

## Steps

### From public/external machine:

```bash
# Test admin console
nc -vz <TPSTORAGE_HOST_OR_IP> 9001
curl -I https://<TPSTORAGE_HOST_OR_IP>:9001/ --max-time 10

# Test internal/management ports
nc -vz <TPSTORAGE_HOST_OR_IP> 2379
nc -vz <TPSTORAGE_HOST_OR_IP> 9100
curl -I http://<TPSTORAGE_HOST_OR_IP>:9001/
````

### From internal/VPN/bastion:

Repeat checks; services should be reachable.

### Validate logs:

Check application logs and firewall for denied external attempts.

## Expected Result

* External/public access: connection refused or timed out; no HTTP success.
* Internal access: ports reachable and services respond.
* Firewall logs show DENY entries for public IPs.

## Actual Result

✅ **Pass**