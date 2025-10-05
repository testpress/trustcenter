---
title: "RBAC Tests — Bucket-level Access Enforcement"
description: "Ensure users cannot access unauthorized buckets; operations must fail with AccessDenied."
---
Bucket-level restriction enforcement

## Purpose
Ensure users cannot access unauthorized buckets.

## Pre-conditions

* User allowed access only to test-bucket.
* Other buckets exist (restricted-bucket).

## Tools

* `rclone`

## Steps

```bash
# Attempt to list unauthorized bucket
rclone ls tpstorage:restricted-bucket

# Attempt object operations on unauthorized bucket
echo "x" > /tmp/file.txt
rclone copy /tmp/file.txt tpstorage:restricted-bucket/
rclone delete tpstorage:restricted-bucket/file.txt
````

## Expected Result

* All operations fail with AccessDenied.
* User can only operate on test-bucket.

## Actual Result

✅ **Pass**

```bash
rclone ls tpstorage_read_only:media.test.testpress.in
2025/10/03 09:10:39 NOTICE: Failed to ls: operation error S3: ListObjectsV2... AccessDenied
rclone delete tpstorage_read_only:media.test.testpress.in/institute/test/tps/videos/0798df4e1a67454c8fc803450fb85cf0.mp4
2025/10/03 09:11:08 ERROR : ... AccessDenied
```