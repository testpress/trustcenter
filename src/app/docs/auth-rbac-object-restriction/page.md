---

title: "RBAC Tests — Object-level Policy Enforcement"
description: "Verify object-level restrictions; users can only read/write allowed objects, others must fail."
---

## Overview

TPStorage implements **Role-Based Access Control (RBAC)** not only at the bucket level but also at the **object level**. This ensures that even within an authorized bucket, a user can only access specific objects explicitly permitted by their policy. Any attempt to access or modify restricted objects must fail with `AccessDenied`.

---

## Why This Matters

Improper object-level permissions can lead to:

* **Unauthorized data access** — users may read sensitive objects they shouldn’t.
* **Data corruption or loss** — unauthorized write operations could overwrite important files.
* **Regulatory non-compliance** — fine-grained access control is required for audit and privacy standards.

Object-level RBAC ensures users operate strictly within their permitted object boundaries, maintaining data confidentiality and integrity.

---

## Control Description

* Each TPStorage user is assigned object-level permissions within a bucket.
* Users may perform operations (read/write) only on **allowed objects**.
* Any operations on restricted objects must be **rejected with `AccessDenied`**.
* Enforcement applies to all object operations — including read, write, copy, and delete.

---

## Testing Methodology

**Preconditions:**

* A user account with access to only specific objects (`allowed-object.txt`) in `test-bucket`.
* Additional restricted objects (`restricted-object.txt`) exist in the same bucket.
* Correctly configured `rclone` profile for the test user (e.g., `tpstorage:` remote).

**Tools Used:**

* `rclone` — command-line S3-compatible storage client.

**Steps Performed:**

1. **Perform allowed object operations:**

```bash
# Create a temporary file
echo "ok" > /tmp/allowed.txt

# Upload to allowed object
rclone copy /tmp/allowed.txt tpstorage:test-bucket/allowed-object.txt

# Download from allowed object
rclone copy tpstorage:test-bucket/allowed-object.txt /tmp/
```

2. **Attempt restricted object operations:**

```bash
# Create a temporary file
echo "fail" > /tmp/restricted.txt

# Attempt to upload to restricted object
rclone copy /tmp/restricted.txt tpstorage:test-bucket/restricted-object.txt

# Attempt to download from restricted object
rclone copy tpstorage:test-bucket/restricted-object.txt /tmp/
```

3. **Validate allowed object listing and content:**

```bash
rclone ls tpstorage:test-bucket/allowed-object.txt
```

---

## Expected Behavior

* **Allowed object operations (read/write)** must succeed.
* **Restricted object operations** must fail with `AccessDenied` or a similar permission-related error.
* Users must not be able to access objects outside their permitted scope.

---

## Actual Results

Testing with a user restricted to `allowed-object.txt` produced the following results:

```bash
# Allowed operations
echo "ok" > /tmp/allowed.txt
rclone copy /tmp/allowed.txt tpstorage_read_only:testing/allowed-object.txt
rclone copy tpstorage_read_only:testing/allowed-object.txt ~/testing/
ls ~/testing/
allowed.txt  hello.txt

# Restricted operations
echo "fail" > /tmp/restricted.txt
rclone copy /tmp/restricted.txt tpstorage_read_only:testing/restricted-object.txt
2025/10/03 09:17:07 ERROR : ... AccessDenied

# Verify allowed object listing
rclone ls tpstorage_read_only:testing/allowed-object.txt
        3 allowed.txt
```

**Result:** ✅ Control Passed

---

## Notes / Remediation

* **If restricted object access is successful**, immediately review object-level policies and user permissions.
* Ensure IAM policies or object-level ACLs correctly enforce `Condition` and `Principal` matching rules.
* Rotate access keys and audit object ACLs if unexpected access occurs.
* Regularly test object-level RBAC using automated tools like `rclone` to prevent misconfigurations.

---

## Status

* **Control ID:** RBAC-OBJECT-ACCESS
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07

---
