---
title: "Encryption Tests — Data-in-Transit (TLS Enforcement)"
description: "Ensure all TPStorage client traffic is encrypted using TLS, and plain HTTP connections are blocked or redirected."
---

Verify HTTPS (TLS) is enforced for PUT/GET requests

## Purpose
Ensure all client traffic uses TLS and plain HTTP is rejected.

## Pre-conditions

* TPStorage endpoint has HTTPS enabled with valid certificate.  
* `rclone` installed.

## Tools

* `rclone`  
* `curl` or `wget` for testing direct HTTP

## Steps

Attempt rclone operation with HTTPS (valid endpoint):

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/ --s3-endpoint https://<TPSTORAGE_HOST>
rclone ls rclone-remote:test-bucket/
````

Attempt rclone operation using HTTP (non-TLS):

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/ --s3-endpoint http://<TPSTORAGE_HOST>
```

Test via curl:

```bash
curl -I http://<TPSTORAGE_HOST>
```

## Expected Result

* HTTPS requests succeed.
* HTTP requests fail (connection refused or redirect to HTTPS).
* No plaintext transmission of credentials or data.

## Actual Result

✅ **Pass**

```bash
rclone copy /tmp/testfile.txt tpstorage_read_only:testing/ --s3-endpoint https://storage1.tpstreams.com --s3-no-check-bucket
rclone ls tpstorage_read_only:testing/ --s3-endpoint https://storage1.tpstreams.com --s3-no-check-bucket
        3 allowed-object.txt/allowed.txt
        5 testfile.txt
```
