---
title: "Ping / Scan from Outside VPC Should Fail"
description: "Ensure TPStorage endpoints are not reachable from the public internet and are protected by firewall rules."
---
Ping / Scan from Outside VPC Should Fail

## Purpose
Confirm TPStorage is not reachable from the public Internet (ICMP/ping or port scans should be blocked/filtered).

## Pre-conditions

* TPStorage hostname or public IP (if any).
* A test machine that is outside the VPC/subnet (e.g., an external VM or office laptop on public internet).
* Authorization to test from that external machine.

## Tools

* `ping`
* `nmap` (recommended) or `masscan`
* `traceroute` / `tracepath`

## Steps

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

## Expected Result

* `ping` should time out or show “destination unreachable” / no reply.
* `nmap` should report ports as filtered or closed, not open.
* `traceroute` should stop at the network boundary (the firewall/VPC edge).
* No public-facing services should be reachable.

## Actual Result
❌ **Fail**

* ICMP (ping): blocked (100% packet loss) ✅
* TCP ports: 80, 443, 9000, 9100 are reachable (open) from external internet ❌
* UDP ports: 123, 161 are open|filtered (needs review) ❌
