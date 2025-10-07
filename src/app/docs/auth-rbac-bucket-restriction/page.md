---

title: "RBAC Tests — Bucket-level Access Enforcement"
description: "Ensure users cannot access unauthorized buckets; operations on restricted buckets must fail with AccessDenied while authorized buckets remain accessible."
---
## Overview

TPStorage implements **Role-Based Access Control (RBAC)** to ensure users can only access buckets they are explicitly authorized for. Each user’s credentials are scoped to specific resources, preventing unauthorized listing, upload, or deletion operations on restricted buckets.

---

## Why This Matters

Improperly configured bucket-level permissions can lead to serious security breaches, including:

* **Data leakage** from unauthorized bucket access.
* **Data tampering or deletion** by users with unintended privileges.
* **Regulatory non-compliance**, as access control is a core security requirement.

By enforcing bucket-level RBAC, TPStorage ensures users operate strictly within their assigned storage boundaries, protecting both organizational and customer data integrity.

---

## Control Description

* Each TPStorage user is assigned specific access permissions defining allowed buckets.
* Attempts to access or modify objects in unauthorized buckets must be **rejected with `AccessDenied`**.
* Authorized buckets (e.g., `test-bucket`) must remain fully functional for legitimate operations.
* Enforcement applies to all operations — including list, copy, delete, upload, and metadata retrieval.

---

## Testing Methodology

**Preconditions:**

* A user account with access to only one bucket (`test-bucket`).
* At least one additional restricted bucket (`restricted-bucket`) that the user cannot access.
* Correctly configured `rclone` profile for the test user (e.g., `tpstorage:` remote).

**Tools Used:**

* `rclone` — command-line S3-compatible storage client.

**Steps Performed:**

1. **Attempt to list an unauthorized bucket:**

```bash
rclone ls tpstorage:restricted-bucket
```

2. **Attempt object operations on the unauthorized bucket:**

```bash
echo "x" > /tmp/file.txt
rclone copy /tmp/file.txt tpstorage:restricted-bucket/
rclone delete tpstorage:restricted-bucket/file.txt
```

3. **Validate operations on authorized bucket (`test-bucket`):**

```bash
rclone ls tpstorage:test-bucket
rclone copy /tmp/file.txt tpstorage:test-bucket/
```

---

## Expected Behavior

* **Unauthorized bucket access** must fail with:

  * `AccessDenied`
  * or similar permission-related error message.
* **Authorized bucket operations** (list, copy, delete) must succeed normally.
* **No cross-bucket access** should ever be permitted for the same credentials.

---

## Actual Results

Testing was performed using user credentials restricted to `test-bucket`. All unauthorized operations were correctly denied.

Example outputs:

```bash
# Unauthorized bucket access
rclone ls tpstorage:restricted-bucket
2025/10/03 09:10:39 NOTICE: Failed to ls: operation error S3: ListObjectsV2, AccessDenied

# Unauthorized delete operation
rclone delete tpstorage:restricted-bucket/file.txt
2025/10/03 09:11:08 ERROR : file.txt: AccessDenied
```

Authorized operations on `test-bucket` succeeded as expected.

**Result:** ✅ Control Passed

---

## Notes / Remediation

* **If access to unauthorized buckets is successful**, immediately review IAM policies and user access configurations.
* Ensure bucket-level policies correctly enforce `Condition` and `Principal` matching rules.
* Rotate access keys and audit bucket ACLs if any unexpected access is detected.
* Regularly test RBAC boundaries using automated compliance checks with tools like `rclone` or `aws s3api`.

---

## Status

- **Control ID:** RBAC-BUCKET-ACCESS
- **Status:** ✅ Implemented and Effective
- **Last Verified:** 2025-10-07
