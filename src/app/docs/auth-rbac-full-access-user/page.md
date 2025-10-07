---
title: "RBAC Tests — Full-access User Operations"
description: "Verify that full-access users can perform all bucket and object operations without restriction on storage1.tpstreams.com."
---
## Overview

TPStorage implements **Role-Based Access Control (RBAC)** to ensure users are granted only the permissions necessary for their operational roles. Full-access users are granted unrestricted access to perform all valid S3-compatible operations across authorized buckets within the system.

This control validates that users with full-access permissions can seamlessly perform all allowed operations — including listing, uploading, downloading, and deleting objects — across their accessible storage scope without encountering permission errors.

---

## Why This Matters

Ensuring full-access users have proper and unrestricted permissions is critical for:

* **Operational efficiency** — authorized teams can manage storage resources without delays or permission barriers.  
* **System reliability** — verifies correct configuration of IAM policies and bucket ACLs.  
* **Security clarity** — confirms that full-access roles are neither overly restricted nor overly permissive.

By validating full-access user permissions, TPStorage ensures alignment with least-privilege principles while enabling appropriate administrative control over storage operations.

---

## Control Description

* Full-access users are granted comprehensive permissions for all buckets on `storage1.tpstreams.com`.  
* They should be able to execute all operations — including bucket listing, object uploads, downloads, and deletions.  
* No operation should fail with `AccessDenied` or related permission errors.  
* Policies applied to full-access users should reflect the correct balance of privileges and boundaries.

---

## Testing Methodology

**Preconditions:**

* A valid user account configured with full-access permissions.
* At least one accessible bucket (`test-bucket`) on `storage1.tpstreams.com`.
* Correctly configured `rclone` remote for the user (`tpstorage:`).

**Tools Used:**

* `rclone` — command-line client for S3-compatible object storage.

**Steps Performed:**

1. **List all available buckets:**
   ```bash
   rclone lsd tpstorage:
   ```

2. **Upload an object to the test bucket:**

   ```bash
   echo "hello" > /tmp/hello.txt
   rclone copy /tmp/hello.txt tpstorage:test-bucket/
   ```

3. **Download the object from the bucket:**

   ```bash
   rclone copy tpstorage:test-bucket/hello.txt /tmp/
   ```

4. **Delete the uploaded object:**

   ```bash
   rclone delete tpstorage:test-bucket/hello.txt
   ```

---

## Expected Behavior

* All operations complete successfully without errors.
* Bucket listing shows all authorized buckets.
* Upload, download, and delete actions are fully permitted.
* No `AccessDenied`, `PermissionDenied`, or `Forbidden` responses occur during testing.

---

## Actual Results

Testing was performed using a full-access user profile on `storage1.tpstreams.com`.
All operations succeeded without any permission errors, confirming correct full-access configuration.

Example outputs:

```bash
# Upload operation
rclone copy /tmp/hello.txt tpstorage_full_access:testing/
Transferred:            5 B / 5 B, 100%, 123 B/s, ETA 0s

# Download operation
rclone copy tpstorage_full_access:testing/hello.txt ~/testing/
Transferred:            5 B / 5 B, 100%, 98 B/s, ETA 0s

# Delete operation
rclone delete tpstorage_full_access:testing/hello.txt

# List operation
rclone lsd tpstorage_full_access:
          -1 2025-10-07 09:15:02        -1 testing
```

**Result:** ✅ Control Passed

---

## Notes / Remediation

* If any operation fails with `AccessDenied`, review:

  * User’s IAM role or access policy.
  * Bucket policy statements for explicit denies.
  * Key rotation or expired credentials.
* Ensure `rclone` configuration reflects accurate credentials for full-access users.
* Regularly verify full-access permissions to detect accidental policy regressions.

---

## Status

* **Control ID:** RBAC-FULL-ACCESS
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07
