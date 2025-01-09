# Module `openid-silent-login-detector`

![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)



[Source file](..\src\openid-silent-login-detector.js)

# Class `OpenidSilentLoginDetector`

Implements the logic to find out the correct OpenID Connect flow.

## Constructors


### `OpenidSilentLoginDetector(browserWindow)`

Creates an instance of the class with the given parameter.

Parameters | Type | Description
--- | --- | ---
__browserWindow__ | `Window` | *the navigator windows object*

---

## Methods

### `isSilentLogin() ► boolean`

![modifier: public](images/badges/modifier-public.png)

Is a silent login in progress?

Parameters | Type | Description
--- | --- | ---
__*return*__ | `boolean` | *true if a silen login is currently in progress*

---
