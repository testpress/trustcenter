---

title: "Erasure Coding & Bitrot Detection — Object Integrity Verification"
description: "Ensure TPStorage validates object integrity using checksums during retrieval to detect corruption."
---
## Overview

TPStorage implements **object integrity verification** to ensure uploaded data remains unchanged during storage and retrieval. Objects are validated using **checksums** upon download to detect corruption or bitrot.

---

## Why This Matters

Without integrity verification:

* **Data corruption** could go undetected, resulting in corrupted objects being used.
* **Bitrot or silent storage errors** may compromise critical files.
* **Regulatory non-compliance** for systems requiring verifiable storage integrity.

Checksum validation guarantees that objects retrieved from TPStorage match the original uploaded data.

---

## Control Description

* All uploaded objects have a checksum (e.g., SHA256) stored or computed.
* On retrieval, TPStorage or the client computes a checksum and verifies it against the original.
* Any mismatch is treated as corruption, preventing use of invalid data.

---

## Testing Methodology

**Preconditions:**

* An object has been uploaded to TPStorage.
* `rclone` is installed.
* `sha256sum` or a similar checksum utility is available.

**Tools Used:**

* `rclone` — for upload/download.
* `sha256sum` — to verify checksums.

**Steps Performed:**

1. **Upload object via rclone:**

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/
```

2. **Download object using rclone:**

```bash
rclone copy rclone-remote:test-bucket/testfile.txt /tmp/downloaded.txt
```

3. **Verify checksum matches original:**

```bash
sha256sum /tmp/testfile.txt /tmp/downloaded.txt
```

---

## Expected Behavior

* The checksum of the downloaded object **matches the original**.
* No corruption is detected.
* Any mismatch must raise an error.

---

## Actual Results

Testing produced the following output:

```bash
sha256sum /tmp/testfile.txt ~/testing/checksum_test.txt/testfile.txt 
c9d04c9565fc665c80681fb1d829938026871f66e14f501e08531df66938a789  /tmp/testfile.txt
c9d04c9565fc665c80681fb1d829938026871f66e14f501e08531df66938a789  /home/ubuntu/testing/checksum_test.txt/testfile.txt
```

**Result:** ✅ Control Passed

---

## Notes / Remediation

* **If checksum verification fails**, immediately review object storage integrity.
* Check for silent disk errors, network issues, or client misconfigurations.
* Regularly perform automated integrity checks for critical objects.
* Ensure clients and storage enforce consistent checksum algorithms.

---

## Status

* **Control ID:** EC-BITROT-INTEGRITY
* **Status:** ✅ Implemented and Effective
* **Last Verified:** 2025-10-07

---
