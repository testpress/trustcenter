---
title: "Object Versioning — Upload and Overwrite"
description: "Verify that TPStorage preserves previous object versions when an object is overwritten."
---

Upload object → overwrite → verify previous version exists

## Purpose
Confirm versioning preserves previous object versions.

## Pre-conditions

* Bucket with versioning enabled.

## Tools

* `rclone`

## Steps

Upload object:

```bash
rclone copy /tmp/testfile.txt rclone-remote:test-bucket/
````

Overwrite object with modified content:

```bash
rclone copy /tmp/testfile_v2.txt rclone-remote:test-bucket/testfile.txt
```

List object versions (if supported via rclone or API):

```bash
rclone lsjson rclone-remote:test-bucket/ --versions
```

## Expected Result

* Previous version is retained.
* Both versions accessible via API or version listing.

## Actual Result

✅ **Pass**

**Notes / Remediation:**
Verify versioning metadata is accurate.

## Proof

{% docimage 
  title="Multiple versions of same file"
  src="/trustcenter/images/versioning1.png"
  width=800
  height=400
  style="rounded-lg shadow"
%}
{% /docimage %}
