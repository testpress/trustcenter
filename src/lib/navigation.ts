export const navigation = [
  {
    title: 'TLS',
    links: [
      { title: 'HTTP access should be blocked or redirect to HTTPS', href: '/docs/redirect-to-https' },
      { title: 'Verify TLS certificate details and strong cipher suites', href: '/docs/tls-cert-ciphers' },
      { title: 'Weak TLS protocols should be rejected (TLS 1.0 / TLS 1.1)', href: '/docs/weak-protocols' },
      { title: 'MITM interception should be prevented (proxy testing)', href: '/docs/tls-mitm' },

    ],
  },
  {
    title: 'Private Network Endpoints',
    links: [
      { title: 'Allowlisted IPs / Subnets Access Verification', href: '/docs/pne-allowed-ips' },
      { title: 'Connection from Unauthorized IP Should Be Blocked', href: '/docs/pne-unauthorized-ip' },
      // { title: 'Ping / Scan from Outside VPC Should Fail', href: '/docs/pne-outside-vpc' },
    ],
  },
  {
    title: 'Segmentation',
    links: [
      { title: 'Direct SSH/RDP Access Restriction', href: '/docs/seg-direct-ssh-rdp-blocked' },
      { title: 'Administrative Access via Bastion or VPN', href: '/docs/seg-admin-access-bastion-vpn' },
      { title: 'Internal Services Access Restriction', href: '/docs/seg-internal-services-restriction' },
    ],
  },
  {
    title: 'Fine-grained policies & RBAC',
    links: [
      { title: 'Read-only User Restrictions', href: '/docs/auth-rbac-readonly-user' },
      { title: 'Full-access User Operations', href: '/docs/auth-rbac-full-access-user' },
      { title: 'Bucket-level Access Enforcement', href: '/docs/auth-rbac-bucket-restriction' },
      { title: 'Object-level Policy Enforcement', href: '/docs/auth-rbac-object-restriction' },
    ],
  },
  {
    title: 'Encryption - Data in Transit',
    links: [
      { title: 'TLS Enforcement', href: '/docs/enc-tls-data-in-transit' },
    ],
  },
  {
    title: 'Erasure Coding & Bitrot Detection',
    links: [
      { title: 'Object Integrity Verification', href: '/docs/erasure-coding-checksum-validation' },
    ],
  },
  {
    title: 'Object Versioning',
    links: [
      { title: 'Upload, Overwrite, and Recovery', href: '/docs/rd-vr-upload-overwrite' },
      { title: 'Delete and Recover', href: '/docs/rd-vr-delete-recover' },
    ],
  },
]
