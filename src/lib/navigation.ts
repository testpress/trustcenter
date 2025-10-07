export const navigation = [
  {
    title: 'Access Control (RBAC)',
    links: [
      { title: 'Bucket-level Restrictions', href: '/trustcenter/docs/auth-rbac-bucket-restriction' },
      { title: 'Object-level Policies', href: '/trustcenter/docs/auth-rbac-object-restriction' },
      { title: 'Read-only Users', href: '/trustcenter/docs/auth-rbac-readonly-user' },
      { title: 'Full-access Users', href: '/trustcenter/docs/auth-rbac-full-access-user' },
    ],
  },
  {
    title: 'Encryption & TLS',
    links: [
      { title: 'TLS Enforcement', href: '/trustcenter/docs/enc-tls-data-in-transit' },
      { title: 'HTTP → HTTPS Redirect', href: '/trustcenter/docs/redirect-to-https' },
      { title: 'TLS Certificates & Cipher Suites', href: '/trustcenter/docs/tls-cert-ciphers' },
      { title: 'MITM Protection', href: '/trustcenter/docs/tls-mitm' },
      { title: 'Weak Protocol Rejection', href: '/trustcenter/docs/weak-protocols' },
    ],
  },
  {
    title: 'Data Integrity & Durability',
    links: [
      { title: 'Checksum Validation', href: '/trustcenter/docs/erasure-coding-checksum-validation' },
      { title: 'Object Versioning — Delete & Recover', href: '/trustcenter/docs/rd-vr-delete-recover' },
      { title: 'Object Versioning — Upload & Overwrite', href: '/trustcenter/docs/rd-vr-upload-overwrite' },
    ],
  },
  {
    title: 'Network Security',
    links: [
      { title: 'Allowed IP Access', href: '/trustcenter/docs/pne-allowed-ips' },
      { title: 'Unauthorized IP Blocking', href: '/trustcenter/docs/pne-unauthorized-ip' },
      { title: 'External VPC Scan', href: '/trustcenter/docs/pne-outside-vpc' },
    ],
  },
  {
    title: 'Administrative & Internal Access',
    links: [
      { title: 'Bastion/VPN Administrative Access', href: '/trustcenter/docs/seg-admin-access-bastion-vpn' },
      { title: 'Direct SSH/RDP Restriction', href: '/trustcenter/docs/seg-direct-ssh-rdp-blocked' },
      { title: 'Internal Services Restrictions', href: '/trustcenter/docs/seg-internal-services-restriction' },
    ]
  },
];
