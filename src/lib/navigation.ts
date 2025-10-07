export const navigation = [
  {
    title: 'Access Control',
    links: [
      { title: 'Bucket-level Restrictions', href: '/docs/auth-rbac-bucket-restriction' },
      { title: 'Object-level Policies', href: '/docs/auth-rbac-object-restriction' },
      { title: 'Read-only Users', href: '/docs/auth-rbac-readonly-user' },
      { title: 'Full-access Users', href: '/docs/auth-rbac-full-access-user' },
    ],
  },
  {
    title: 'Encryption & TLS',
    links: [
      { title: 'TLS Enforcement', href: '/docs/enc-tls-data-in-transit' },
      { title: 'HTTP → HTTPS Redirect', href: '/docs/redirect-to-https' },
      { title: 'TLS Certificates & Cipher Suites', href: '/docs/tls-cert-ciphers' },
      { title: 'MITM Protection', href: '/docs/tls-mitm' },
      { title: 'Weak Protocol Rejection', href: '/docs/weak-protocols' },
    ],
  },
  {
    title: 'Data Integrity & Durability',
    links: [
      { title: 'Checksum Validation', href: '/docs/erasure-coding-checksum-validation' },
      { title: 'Object Versioning — Delete & Recover', href: '/docs/rd-vr-delete-recover' },
      { title: 'Object Versioning — Upload & Overwrite', href: '/docs/rd-vr-upload-overwrite' },
    ],
  },
  {
    title: 'Network Security',
    links: [
      { title: 'Allowed IP Access', href: '/docs/pne-allowed-ips' },
      { title: 'Unauthorized IP Blocking', href: '/docs/pne-unauthorized-ip' },
      { title: 'External VPC Scan', href: '/docs/pne-outside-vpc' },
    ],
  },
  {
    title: 'Administrative & Internal Access',
    links: [
      { title: 'Bastion/VPN Administrative Access', href: '/docs/seg-admin-access-bastion-vpn' },
      { title: 'Direct SSH/RDP Restriction', href: '/docs/seg-direct-ssh-rdp-blocked' },
      { title: 'Internal Services Restrictions', href: '/docs/seg-internal-services-restriction' },
    ],
  },
];
