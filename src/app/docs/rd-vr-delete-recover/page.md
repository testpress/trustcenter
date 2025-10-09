---

title: "Object Versioning — Delete and Recover"
description: "Ensure previous object versions remain recoverable after deletion in TPStorage."
---
## Overview

TPStorage supports **object versioning**, allowing previous versions of objects to remain recoverable after deletion. This protects against accidental data loss and enables rollback to prior object states.

---

## Why This Matters

Without versioning:

* **Deleted objects are permanently lost**, risking data loss.
* **Accidental overwrites** cannot be reverted.
* Compliance or audit requirements for **data retention** may be violated.

Versioning ensures all object changes can be tracked and recovered if necessary.

---

## Control Description

* Buckets must have **versioning enabled**.
* Deleted objects retain previous versions until they expire per lifecycle policies.
* Clients can recover older versions using version IDs.

---

## Testing Methodology

**Preconditions:**

* Bucket with versioning enabled.
* Multiple versions of the same object exist.

**Tools Used:**

* `rclone` — S3-compatible client for upload, delete, and version operations.

**Steps Performed:**

1. **Delete the latest object version:**

```bash
rclone delete rclone-remote:test-bucket/testfile.txt
```

2. **List remaining object versions:**

```bash
rclone lsjson rclone-remote:test-bucket/ --versions
```

3. **Download previous version using version ID if needed:**

```bash
rclone copy rclone-remote:test-bucket/testfile.txt?versionId=<VERSION_ID> /tmp/restored.txt
```

---

## Expected Behavior

* Previous object versions remain **recoverable**.
* Deleted version appears marked as deleted but is **not permanently lost** until expiration (per lifecycle rules).

---

## Actual Results

✅ **Pass**

*Previous versions verified and recoverable.*

---

## Notes / Remediation

* Ensure versioning is enabled on all critical buckets.
* Verify that metadata and version IDs are correct for recoverability.
* Test recovery process periodically to confirm operational integrity.

---

## Status

* **Control ID:** OBJ-VERSION-RECOVERY
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07
