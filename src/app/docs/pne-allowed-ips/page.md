---
title: "Verify Allowed IPs / Subnets Can Access TPStorage"
description: "Confirm systems from allowlisted IPs/subnets can reach TPStorage endpoints successfully, ensuring proper access control while blocking unauthorized sources."
---
Verify Allowed IPs / Subnets Can Access TPStorage

## Purpose
Confirm systems from the allowlisted IPs/subnets can reach TPStorage and that access is functional.

## Pre-conditions

* A test machine inside the allowed subnet/VPC (or with an allowed source IP).
* TPStorage endpoint and credentials (if performing authenticated operations).
* Knowledge of the exact allowlist (IP/CIDR) configured in firewall or security groups.

## Tools

* `curl`, `nc`, `aws` CLI or `mc` (MinIO client) for functional tests  
* `s3cmd` or `aws s3` (if configured), or `mc` for S3-compatible operations

## Steps — A. Connectivity Checks (Basic)

```bash
# From an allowed-IP machine, test TCP connect
nc -vz <TPSTORAGE_HOST_OR_IP> 443
nc -vz <TPSTORAGE_HOST_OR_IP> 9000

# Test HTTP HEAD request
curl -I https://<TPSTORAGE_HOST_OR_IP>/
````

## Expected Result

* `nc` / `curl` should succeed and show open/connectable status.
* All network-level firewall logs should show **ALLOW** for the test IP/CIDR.

## Actual Result

✅ **Pass**
