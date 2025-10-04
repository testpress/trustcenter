---
title: "HTTP access should be blocked or redirect to HTTPS"
description: "Ensure plain HTTP connections to TPStorage endpoints are either redirected to HTTPS or blocked, protecting sensitive data from exposure."
---

HTTP access should be blocked or redirect to HTTPS

## Purpose
Ensure plain HTTP is not used — connections must be HTTPS (either redirect or block).

## Pre-conditions

* TPStorage endpoint (hostname or IP) and public port (usually 80/443) are known.  
* Network access to the endpoint from a test client.

## Tools

* `curl` (Linux/macOS/WSL)  
* Browser (optional)

## Steps


```bash
# Test plain HTTP response headers and status
curl -v --max-redirs 0 http://<HOST>:80/ 2>&1 | sed -n '1,200p'

# If using a custom port
curl -v --max-redirs 0 http://<HOST>:<PORT>/ 2>&1 | sed -n '1,200p'

# Fetch headers only
curl -I http://<HOST>/

# Inspect redirects
curl -IL http://<HOST>/ | sed -n '1,200p'
````

(Optional) Open in a browser and check if `http://` redirects to `https://` or shows an error.



## Expected Result:

* Server must either

  * Return HTTP 301/302 redirect to `https://<HOST>/` (Location header present), **OR**
  * Refuse HTTP connection (403/connection refused), but HTTPS must be available.
* No sensitive content is exposed over plain HTTP.

## Actual Result:
✅ **Pass**



```bash
curl -v --max-redirs 0 http://storage1.tpstreams.com/ 2>&1 | sed -n '1,200p'

* Host storage1.tpstreams.com:80 was resolved.
* Connected to storage1.tpstreams.com (65.109.153.91) port 80
> GET / HTTP/1.1
> Host: storage1.tpstreams.com
...
< HTTP/1.1 403 Forbidden
< Server: nginx/1.18.0 (Ubuntu)
< Strict-Transport-Security: max-age=31536000; includeSubDomains
...
<Error><Code>AccessDenied</Code><Message>Access Denied.</Message></Error>
```

