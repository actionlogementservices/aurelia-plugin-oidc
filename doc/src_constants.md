# Module `constants`

![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)

Defines the Aurelia plugin constants.

[Source file](..\src\constants.js)

## Constants

### `getCurrentRouteInfo`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Gets the useful part of the navigation instruction for redirecting within the aurelia application.

Parameters | Type | Description
--- | --- | ---
__instruction__ | `NavigationInstruction` | *the navigation instruction*
__*return*__ | `string` | *the useful part of the navigation instruction*

#### Value

```javascript
instruction => instruction?.fragment
```

---

### `ROUTES`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

The routes definitions to add for OpenID Connect.

#### Value

```javascript
{
  signinRedirectCallback: { name: 'signinRedirectCallback', url: 'signin-oidc' },
  signoutRedirectCallback: { name: 'signoutRedirectCallback', url: 'signout-oidc' }
}
```

---

### `defaultReconnectPrompt`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default reconnection prompt based on the Window.confirm() method.

Parameters | Type | Description
--- | --- | ---
__loginFunction__ | `function` | *the internal reconnection logic to trigger in your prompt*
__*return*__ | `void` | **

#### Value

```javascript
loginFunction => {
  // eslint-disable-next-line no-alert
  if (confirm('Session expired. Reconnect?')) loginFunction();
}
```

---

### `defaultUserIdClaimSelector`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default claim that represents the user identifier.
The default claim is &quot;name&quot;.

Parameters | Type | Description
--- | --- | ---
__profile__ | `UserProfile` | *the user profile containing claims*
__*return*__ | `string` | *the user identifier*

#### Value

```javascript
profile => profile.name
```

---

### `defaultLoginRequiredSelector`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default silent login error code that triggers a reconnection prompt.

Parameters | Type | Description
--- | --- | ---
__errorReponse__ | `ErrorResponse` | *the error object returned by the identity provider*
__*return*__ | `boolean` | *the condition on error response object to trigger the complete login*

#### Value

```javascript
errorReponse => errorReponse.error === 'interaction_required'
```

---

### `defaultSimulationUser`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default user in simulation mode.

#### Value

```javascript
{
  profile: { name: 'Test User' },
  expired: false,
  access_token: '0123456789'
}
```

---

### `defaultOnError`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Defines the default onError callback (do nothing).

Parameters | Type | Description
--- | --- | ---
__errorReponse__ | `ErrorResponse` | *the error object returned by the identity provider*
__*return*__ | `void` | **

#### Value

```javascript
errorReponse => {}
```

---
