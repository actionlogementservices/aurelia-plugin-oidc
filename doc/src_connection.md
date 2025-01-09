# Module `connection`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)



[Source file](..\src\connection.js)

# Class `Connection`

Provides an encapsulation of the OpenID Connect user connection.

## Constructors


### `Connection(router, configuration, userManager, userPrompt)`

Creates an instance of the class with the given parameter.

Parameters | Type | Description
--- | --- | ---
__router__ | `Router` | *the aurelia router*
__configuration__ | [PluginConfiguration](src_plugin-configuration.md) | *the openid plugin configuration*
__userManager__ | `UserManager` | *the openid user manager*
__userPrompt__ | [UserPrompt](src_user-prompt.md) | *the user prompt to confirm reconnection*

---

## Methods

### `observeUser(userfunc) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Defines a callback called when user connection changes.

Parameters | Type | Description
--- | --- | ---
__userfunc__ | `(user: User) => void` | *a callback called when user connection changes*
__*return*__ | `Promise.<void>` | *the promise that retrieves user*

---

### `getUser() ► Promise.<User>`

![modifier: public](images/badges/modifier-public.png)

Retrieves the connected user.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `Promise.<User>` | *the connected user*

---

### `loginUser(route, options) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Initiates the OpenID Connect user connection.

Parameters | Type | Description
--- | --- | ---
__route__ | `string` | *the aurelia route name to be redirected after login - if not specified this will be the current route*
__options__ | `ExtraSigninRequestArgs` | *optional options passed to underlying oidc signin method*
__*return*__ | `Promise.<void>` | **

---

### `logoutUser(route, options) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Initiates the OpenID Connect user deconnection.

Parameters | Type | Description
--- | --- | ---
__route__ | `string` | *the aurelia route name to be redirected after logout - if not specified this will be the current route*
__options__ | `ExtraSignoutRequestArgs` | *optional options passed to underlying oidc signout method*
__*return*__ | `Promise.<void>` | **

---

### `trySilentLogin(route) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Initiates the OpenID Connect silent user connection and displays the reconnect prompt if asked by the provider.

Parameters | Type | Description
--- | --- | ---
__route__ | `string` | *the aurelia route name to be redirected in case of reconnnect prompt - if not specified this will be the current route*
__*return*__ | `Promise.<void>` | **

---

### `_setUser(user)`

![modifier: private](images/badges/modifier-private.png)

Sets the connected user entity.

Parameters | Type | Description
--- | --- | ---
__user__ | `User` | *the OpenID Connect user*

---

## Members

Name | Type | Description
--- | --- | ---
__inProgress__ | `boolean` | *Is silent login in progress?*
__userId__ | `string` | *The user identifier. It may be undefined.*
__isUserLoggedIn__ | `boolean` | *Is the user currently connected with an eventually expired access token?*
__hasValidAccessToken__ | `boolean` | *Has the user a valid access token?*
__accessToken__ | `string` | *The user access token. The token may be expired. Check hasValidAccessToken property before.*
__userName__ | `string` | *The display name of the user. The &#x27;name&#x27; claim is used to provide this information.*
__profile__ | `UserProfile` | *The profile of the user. It contains the claims provided by the identity provider.*
__expiresIn__ | `number` | *The number of seconds the access token has remaining.*
