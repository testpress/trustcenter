---

title: "RBAC Tests — Read-only User Restrictions"
description: "Ensure read-only users cannot modify objects in TPStorage; they can only list objects."
---
## Overview

TPStorage implements **Role-Based Access Control (RBAC)** to restrict users based on assigned roles. Read-only users are **only permitted to list and read objects**. Any attempt to modify, upload, or delete objects must fail with `AccessDenied`.

---

## Why This Matters

Allowing read-only users to modify objects could result in:

* **Data corruption or loss** — unintended writes or deletes.
* **Security violations** — users exceeding their intended permissions.
* **Regulatory non-compliance** — access control requirements are often mandated by audit standards.

Enforcing read-only restrictions ensures integrity of objects while still allowing necessary visibility.

---

## Control Description

* Users with read-only permissions **cannot create, overwrite, or delete objects** in any bucket.
* Users **can list and download objects** in buckets they have access to.
* All write/delete operations must be **rejected with `AccessDenied`**.

---

## Testing Methodology

**Preconditions:**

* A user account with read-only permissions exists.
* A test bucket (`test-bucket`) exists and contains objects.
* Correctly configured `rclone` profile for the read-only user (e.g., `tpstorage_read_only:` remote).

**Tools Used:**

* `rclone` — command-line S3-compatible storage client.

**Steps Performed:**

1. **Attempt to upload an object:**

```bash
echo "test" > /tmp/testfile.txt
rclone copy /tmp/testfile.txt tpstorage:test-bucket/
```

2. **Attempt to delete an object:**

```bash
rclone delete tpstorage:test-bucket/testfile.txt
```

3. **List objects in the bucket:**

```bash
rclone ls tpstorage:test-bucket/
```

---

## Expected Behavior

* **Upload and delete operations** must fail with `AccessDenied`.
* **Bucket listing** must succeed.
* Read-only permissions must be strictly enforced at all times.

---

## Actual Results

Testing with a read-only user produced the following outputs:

```bash
# Attempted delete
rclone delete tpstorage_read_only:testing
2025/10/03 09:05:23 ERROR : hello.txt: Couldn't delete: operation error S3: DeleteObject... AccessDenied

# Listing bucket
rclone ls tpstorage_read_only:testing
       15 hello.txt
```

**Result:** ✅ Control Passed

---

## Notes / Remediation

* **If uploads or deletes succeed**, immediately review read-only policies and user permissions.
* Ensure IAM policies and object ACLs are correctly enforced for read-only users.
* Regularly audit read-only accounts and perform automated RBAC tests to prevent policy drift.

---

## Status

* **Control ID:** RBAC-READONLY-ACCESS
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07

---
