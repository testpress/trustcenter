---
title: "RBAC Tests — Full-access User Operations"
description: "Verify that full-access users can perform all bucket and object operations without restriction."
---
Full-access user can perform all operations

## Purpose
Verify full-access user can perform all bucket/object operations.

## Pre-conditions

* Full-access user exists.
* Test bucket exists.

## Tools

* `rclone`

## Steps

```bash
# List buckets
rclone lsd tpstorage:

# Upload object
echo "hello" > /tmp/hello.txt
rclone copy /tmp/hello.txt tpstorage:test-bucket/

# Download object
rclone copy tpstorage:test-bucket/hello.txt /tmp/

# Delete object
rclone delete tpstorage:test-bucket/hello.txt
````

## Expected Result

* All operations succeed without errors.

## Actual Result

✅ **Pass**

```bash
rclone copy tpstorage_read_only:testing/hello.txt ~/testing/
ls ~/testing/
rclone delete tpstorage_read_only:testing/hello.txt
rclone ls tpstorage_read_only:testing/hello.txt
```