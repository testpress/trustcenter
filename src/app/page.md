---
title: "TPStorage Trust Center"
description: "Security, compliance, and data protection documentation for TPStorage."
---
# 🛡️ TPStorage Trust Center

Welcome to the **TPStorage Trust Center** — a transparent knowledge base of our security controls, network protections, and data integrity practices. 

Here, you can explore how TPStorage protects your data through role-based access, strong encryption, network restrictions, and rigorous validation testing.


---

## 🔐 Access Control

We enforce **strict role-based access control (RBAC)** to ensure users can access only what they’re authorized to.

* [Bucket-level Restrictions](/trustcenter/docs/auth-rbac-bucket-restriction) — Restrict users to specific buckets; unauthorized buckets return `AccessDenied`.
* [Object-level Policies](/trustcenter/docs/auth-rbac-object-restriction) — Enforce read/write rules per object to implement least-privilege.
* [Read-only Users](/trustcenter/docs/auth-rbac-readonly-user) — Verify read-only users can list but not modify objects.
* [Full-access Users](/trustcenter/docs/auth-rbac-full-access-user) — Validate unrestricted access for trusted users.

All RBAC configurations are tested regularly to ensure correct enforcement.


---

## 🔒 Encryption & TLS

All communication with TPStorage is **encrypted in transit**. We also ensure legacy and insecure protocols are disabled.

* [TLS Enforcement](/trustcenter/docs/enc-tls-data-in-transit) — HTTPS is required for all endpoints; plain HTTP is blocked.
* [HTTP → HTTPS Redirect](/trustcenter/docs/redirect-to-https) — HTTP access returns 301 or 403, ensuring secure redirection.
* [TLS Certificates & Cipher Suites](/trustcenter/docs/tls-cert-ciphers) — Verified valid certificates and strong modern ciphers only.
* [MITM Protection](/trustcenter/docs/tls-mitm) — Tests confirm interception attempts are blocked, with proper HSTS headers.
* [Weak Protocol Rejection](/trustcenter/docs/weak-protocols) — TLS 1.0/1.1 are disabled; only TLS 1.2+ allowed.


---

## 🧮 Data Integrity & Durability

TPStorage uses **checksums, erasure coding, and object versioning** to ensure data durability and integrity.

* [Checksum Validation](/trustcenter/docs/erasure-coding-checksum-validation) — Detects corruption during downloads using SHA-256.
* [Object Versioning — Delete & Recover](/trustcenter/docs/rd-vr-delete-recover) — Previous versions remain recoverable after deletion.
* [Object Versioning — Upload & Overwrite](/trustcenter/docs/rd-vr-upload-overwrite) — Overwritten objects retain older versions.

These mechanisms safeguard against accidental changes, corruption, and data loss.


---

## 🌐 Network Security

Our storage infrastructure is secured by layered **network perimeter defenses**.

* [Allowed IP Access](/trustcenter/docs/pne-allowed-ips) — Only allowlisted IPs/subnets can connect to endpoints.
* [Unauthorized IP Blocking](/trustcenter/docs/pne-unauthorized-ip) — Unauthorized sources are actively blocked.
* [External VPC Scan](/trustcenter/docs/pne-outside-vpc) — Regular external scans ensure no unexpected exposures.

### Administrative & Internal Access

* [Bastion/VPN Administrative Access](/trustcenter/docs/seg-admin-access-bastion-vpn) — All admin actions go through secure bastion or VPN.
* [Direct SSH/RDP Restriction](/trustcenter/docs/seg-direct-ssh-rdp-blocked) — Public SSH/RDP access is blocked.
* [Internal Services Restrictions](/trustcenter/docs/seg-internal-services-restriction) — Internal APIs and consoles are only reachable from trusted networks.


---

## 📚 Quick Links

* 🔐 [Access Control Policies](/trustcenter/docs/auth-rbac-bucket-restriction)
* 🌍 [Network Security](/trustcenter/docs/pne-allowed-ips)
* 🧮 [Data Integrity & Durability](/trustcenter/docs/erasure-coding-checksum-validation)
* 🔒 [Encryption & TLS](/trustcenter/docs/tls-cert-ciphers)


---

## 📝 About This Trust Center

This knowledge base is built for **security transparency**. Each section is backed by **real, reproducible tests** using tools like `rclone`, `curl`, `openssl`, and `nmap`.

We continuously update these docs as we enhance TPStorage. 

For questions or security reports, contact **[security@testpress.in](mailto:security@testpress.in)**.
