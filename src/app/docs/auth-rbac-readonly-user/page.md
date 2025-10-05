---
title: "RBAC Tests — Read-only User Restrictions"
description: "Ensure read-only users cannot modify objects in TPStorage; they can only list objects."
---
Read-only user cannot write or delete objects

## Purpose
Ensure read-only users cannot modify objects.

## Pre-conditions

* User with read-only policy exists.
* Test bucket exists.

## Tools

* `rclone`

## Steps

```bash
# Attempt to upload
echo "test" > /tmp/testfile.txt
rclone copy /tmp/testfile.txt tpstorage:test-bucket/

# Attempt to delete
rclone delete tpstorage:test-bucket/testfile.txt

# Attempt to list bucket
rclone ls tpstorage:test-bucket/
````

## Expected Result

* Upload and delete fail with AccessDenied.
* Bucket listing works.

## Actual Result

✅ **Pass**



```bash
rclone delete tpstorage_read_only:testing
2025/10/03 09:05:23 ERROR : hello.txt: Couldn't delete: operation error S3: DeleteObject... AccessDenied
rclone ls tpstorage_read_only:testing
       15 hello.txt
```