
## Test Case TLS-02 — Verify TLS certificate details and strong cipher suites

**Purpose:**
Confirm the certificate is valid (issuer, subject, expiry) and the server only supports modern TLS (1.2+) and strong ciphers.

**Pre-conditions:**

* HTTPS endpoint reachable (port 443 or configured HTTPS port).

**Tools:**

* `openssl`
* `openssl x509` or `s_client`
* `nmap` with `--script ssl-enum-ciphers` (optional)
* Browser certificate viewer (optional)

**Steps:**

<details>
<summary>Show commands for TLS certificate and cipher check</summary>

```bash
# Inspect certificate (issuer, validity dates, SANs)
echo | openssl s_client -connect <HOST>:443 -servername <HOST> 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates -ext subjectAltName

# View full certificate chain
openssl s_client -connect <HOST>:443 -servername <HOST> -showcerts

# Check supported TLS versions and ciphers
nmap --script ssl-enum-ciphers -p 443 <HOST>

# Check for HSTS header (optional)
curl -I https://<HOST>/ | grep -i Strict-Transport-Security || true
```

(Optional) Inspect certificate in browser (click padlock → certificate).

</details>

**Expected Result:**

* **Certificate:**

  * Issuer = valid CA (Let's Encrypt, customer CA, or internal trusted CA).
  * `Not Before` / `Not After` dates indicate certificate is currently valid.
  * Subject / SAN includes the hostname clients use.
* **Cipher/TLS policy:**

  * TLS 1.2 and TLS 1.3 supported; TLS 1.0 and 1.1 disabled.
  * Only strong ciphers offered (AEAD ciphers like `TLS_AES_128_GCM_SHA256`, ECDHE suites). No RC4, DES, or export ciphers.
* **HSTS header:** Present for the domain (recommended).

**Actual Result:** ✅ **Pass**

<details>
<summary>Show SSL Labs result</summary>

[SSL Labs Report](https://www.ssllabs.com/ssltest/analyze.html?d=storage1.tpstreams.com)

![SSL Labs Result](/api/attachments.redirect?id=6ee5e90b-3143-4887-be38-55ab5a35c4df)

</details>

---

## Test Case TLS-03 — Weak TLS protocols should be rejected (TLS 1.0 / TLS 1.1)

**Purpose:**
Verify the server rejects old and insecure TLS versions.

**Pre-conditions:**

* HTTPS endpoint reachable.

**Tools:**

* `openssl` (client)
* `testssl.sh` or `nmap` (optional)

**Steps:**

<details>
<summary>Show commands to test TLS versions</summary>

```bash
# Test TLS 1.0
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1 \
  2>&1 | sed -n '1,200p'

# Test TLS 1.1
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_1 \
  2>&1 | sed -n '1,200p'

# Test TLS 1.2 and TLS 1.3 to confirm modern versions work
openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_2 \
  2>&1 | sed -n '1,200p'

openssl s_client -connect <HOST>:443 -servername <HOST> -tls1_3 \
  2>&1 | sed -n '1,200p'

# Optional: Use testssl.sh to get full compatibility matrix
./testssl.sh <HOST>:443
```

</details>

**Expected Result:**

* `openssl` attempts for `-tls1` and `-tls1_1` should fail to negotiate a session (e.g., `handshake failure` or `no shared cipher`).
* `-tls1_2` and `-tls1_3` should succeed if the client supports them.
* No successful connection using TLS 1.0/1.1.

**Actual Result:** ✅ Pass

<details>
<summary>Show test output / screenshot</summary>

![TLS 1.0/1.1 Rejection Result](/api/attachments.redirect?id=24af23f7-ff15-4cf5-8c8a-3a28834e3230)

</details>

---

## Test Case TLS-04 — MITM interception should be prevented (proxy testing)

**Purpose:**
Confirm HTTPS prevents interception and that clients/browsers warn when presented with an untrusted intermediary certificate. Also verify HSTS is present to reduce downgrade risk.

**Pre-conditions**

* Test environment where you can safely run an interception proxy (dedicated test VM or lab).
* TPStorage is reachable from the test client.
* You must only perform MITM testing on systems you own or are explicitly authorized to test.

**Tools**

* `mitmproxy` or Burp Suite (interception)
* Browser or `curl` configured to use a proxy
* (Optional) Access to a test VM's certificate store if you want to simulate a trusted proxy — **do not install untrusted CA certs on production clients.**

**Steps**

<details>
<summary>Show test steps & commands</summary>

1. **Baseline (no proxy)**

   * From a browser or `curl`, access `https://<HOST>/` and confirm a normal HTTPS connection:

   ```bash
   curl -I https://<HOST>/ 2>&1 | sed -n '1,200p'
   ```

2. **Attempt interception without trusting proxy CA (safe test)**

   * Start mitmproxy (default listens on 8080):

   ```bash
   mitmproxy --mode regular --listen-port 8080
   ```

   * Configure browser or `curl` to use the proxy but **do not** install mitmproxy’s CA cert into the browser/system. For `curl`:

   ```bash
   curl -x http://127.0.0.1:8080 https://<HOST>/ -v
   ```

   * Try to visit the HTTPS site:

     * **Expected:** Browser shows an HTTPS certificate error/warning (untrusted issuer). `curl` shows an SSL/TLS verification error (e.g., `SSL certificate problem: unable to get local issuer certificate` or `SSL: certificate subject name ...`).

3. **(Optional) Interception with trusted proxy CA — controlled simulation only**

   * In a disposable test VM, install mitmproxy CA into the trust store, then repeat the request through the proxy. The proxy will be able to decrypt/inspect traffic. This simulates a client that trusts a malicious/compromised CA — use only in an isolated lab.

4. **Check HSTS header** (see TLS-02):

```bash
curl -I https://<HOST>/ | grep -i Strict-Transport-Security || true
```

</details>

**Expected Result**

* With proxy CA **not trusted** by the client:

  * Browser displays a certificate error and refuses to load content.
  * `curl` fails TLS verification unless `-k`/`--insecure` is used.
* With proxy CA **trusted** (test VM only), interception will succeed — this demonstrates why protecting client root stores is critical.
* HSTS header present reduces the risk of downgrade attacks.

**Actual Result:** ✅ Pass

```bash
| Test                        | Expected Result                  | Actual Result                                                                                | Status |
| --------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| HTTPS baseline              | TLS handshake succeeds           | TLS handshake succeeds (`400 Bad Request` not critical)                                      | PASS   |
| MITM proxy (CA not trusted) | Connection rejected / cert error | curl fails with `SSL certificate problem: unable to get local issuer certificate`            | PASS   |
| HSTS header                 | Present                          | Verified (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)                  | PASS   |
```

**Notes / Remediation**

* Never install untrusted CA certificates on production or user machines. Limit testing to isolated VMs.
* If clients accept the proxy CA unexpectedly, audit client trust stores and remove unauthorized root certs.
* Ensure `Strict-Transport-Security` is set with an appropriate `max-age` and `includeSubDomains` as needed to reduce downgrade risk.
* If interception succeeds on production clients without a trusted CA, investigate client compromise or improper trust store configuration immediately.

```

