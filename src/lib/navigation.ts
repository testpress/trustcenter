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
]
