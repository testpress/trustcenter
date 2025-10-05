---
title: "Object Versioning — Delete and Recover"
description: "Ensure previous object versions remain recoverable after deletion in TPStorage."
---

Delete object → verify previous versions are recoverable

## Purpose
Ensure object versions are not lost after deletion.

## Pre-conditions

* Bucket with versioning enabled.  
* Multiple versions uploaded.

## Tools

* `rclone`

## Steps

Delete latest object version:

```bash
rclone delete rclone-remote:test-bucket/testfile.txt
````

List remaining versions:

```bash
rclone lsjson rclone-remote:test-bucket/ --versions
```

Download previous version via version ID if needed.

## Expected Result

* Previous versions remain recoverable.
* Deleted version appears marked but not permanently lost until expiration (if version lifecycle applies).

## Actual Result

✅ **Pass**

**Notes / Remediation:**
Ensure previous versions are accessible and metadata is correct.
