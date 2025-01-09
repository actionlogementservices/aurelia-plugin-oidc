# Module `oauth2-interceptor`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)



[Source file](..\src\oauth2-interceptor.js)

# Class `Oauth2Interceptor`

Implements a custom interceptor that sets OAuth2 bearer token and
obtains a new token when expired.
Use this class to configure your http client to try a silent login when access token is expired
and to add the bearer token.

## Constructors


### `Oauth2Interceptor(connection, detector)`

Creates an instance of the class with the specified parameters.

Parameters | Type | Description
--- | --- | ---
__connection__ | [Connection](src_connection.md) | *the OpenID Connect user connection*
__detector__ | [OpenidSilentLoginDetector](src_openid-silent-login-detector.md) | *the silent login detector*

---

## Methods

### `request(request) ► Promise.<Request>`

![modifier: public](images/badges/modifier-public.png)

Intercepts and handles the request.

Parameters | Type | Description
--- | --- | ---
__request__ | `Request` | *the intercepted request*
__*return*__ | `Promise.<Request>` | *the intercepted request*

---
