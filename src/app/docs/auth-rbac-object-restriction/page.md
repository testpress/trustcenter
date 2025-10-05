---
title: "RBAC Tests — Object-level Policy Enforcement"
description: "Verify object-level restrictions; users can only read/write allowed objects, others must fail."
---
Object-level policy enforcement

## Purpose
Verify object-level restrictions are enforced.

## Pre-conditions

* User can read/write only allowed-object* in test-bucket.
* Other objects exist (restricted-object.txt).

## Tools

* `rclone`

## Steps

```bash
# Allowed object operations
echo "ok" > /tmp/allowed.txt
rclone copy /tmp/allowed.txt tpstorage:test-bucket/allowed-object.txt
rclone copy tpstorage:test-bucket/allowed-object.txt /tmp/

# Restricted object operations
rclone copy /tmp/restricted.txt tpstorage:test-bucket/restricted-object.txt
rclone copy tpstorage:test-bucket/restricted-object.txt /tmp/
````

## Expected Result

* Allowed object operations succeed.
* Restricted object operations fail with AccessDenied.

## Actual Result

✅ **Pass**

```bash
echo "ok" > /tmp/allowed.txt
rclone copy /tmp/allowed.txt tpstorage_read_only:testing/allowed-object.txt
rclone copy tpstorage_read_only:testing/allowed-object.txt ~/testing/
ls ~/testing/
allowed.txt  hello.txt

echo "fail" > /tmp/restricted.txt
rclone copy /tmp/restricted.txt tpstorage_read_only:testing/restricted-object.txt
2025/10/03 09:17:07 ERROR : ... AccessDenied
rclone ls tpstorage_read_only:testing/allowed-object.txt
        3 allowed.txt
```
