---
title: "Erasure Coding & Bitrot Detection — Object Integrity Verification"
description: "Ensure TPStorage validates object integrity using checksums during retrieval to detect corruption."
---

Upload object → verify checksum validation on GET

## Purpose
Ensure TPStorage validates object integrity via checksums during retrieval.

## Pre-conditions

* Object uploaded to TPStorage.  
* `rclone` installed.

## Tools

* `rclone`  
* `sha256sum` (or other checksum tool)

## Steps

Upload object via rclone:

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/
````

Download object using rclone:

```bash
rclone copy rclone-remote:test-bucket/testfile.txt /tmp/downloaded.txt
```

Verify checksum matches original:

```bash
sha256sum /tmp/testfile.txt /tmp/downloaded.txt
```

## Expected Result

* Checksum of downloaded object matches original.
* No corruption detected.

## Actual Result

✅ **Pass**

```bash
sha256sum /tmp/testfile.txt ~/testing/checksum_test.txt/testfile.txt 
c9d04c9565fc665c80681fb1d829938026871f66e14f501e08531df66938a789  /tmp/testfile.txt
c9d04c9565fc665c80681fb1d829938026871f66e14f501e08531df66938a789  /home/ubuntu/testing/checksum_test.txt/testfile.txt
```
