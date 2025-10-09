---

title: "Object Versioning — Upload and Overwrite"
description: "Verify that TPStorage preserves previous object versions when an object is overwritten."
---

## Overview

TPStorage **object versioning** ensures that when an object is overwritten, previous versions are preserved. This allows rollback to prior states and protects against accidental overwrites.

---

## Why This Matters

Without proper versioning:

* **Overwritten data may be lost permanently**.
* Accidental changes cannot be reverted.
* Audit and compliance requirements for historical data may be violated.

Versioning ensures data integrity and recoverability.

---

## Control Description

* Buckets must have **versioning enabled**.
* Overwriting an object should **retain previous versions**.
* All versions are accessible via API, CLI, or version listing tools.

---

## Testing Methodology

**Preconditions:**

* Bucket with versioning enabled.

**Tools Used:**

* `rclone` — for upload, overwrite, and version listing.

**Steps Performed:**

1. **Upload the initial object:**

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/
```

2. **Overwrite the object with modified content:**

```bash
rclone copy /tmp/testfile_v2.txt rclone-remote:test-bucket/testfile.txt
```

3. **List object versions to verify retention:**

```bash
rclone lsjson rclone-remote:test-bucket/ --versions
```

---

## Expected Behavior

* The previous version of the object is **retained**.
* Both the original and overwritten versions are **accessible** via API or version listing.

---

## Actual Results

✅ **Pass**

*Versions verified and retrievable.*

---

## Notes / Remediation

* Verify that **versioning metadata** is accurate and complete.
* Periodically audit version history for critical objects.

---

## Proof

{% docimage
title="Multiple versions of same file"
src="/trustcenter/images/versioning1.png"
width=800
height=400
style="rounded-lg shadow"
%}
{% /docimage %}

---

## Status

* **Control ID:** OBJ-VERSION-UPLOAD
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07
