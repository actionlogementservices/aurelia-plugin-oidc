# Module `openid-routing`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)



[Source file](..\src\openid-routing.js)

# Class `OpenidRouting`

Extends the aurelia application router to support the OpenID Connect redirections.
Use this class in app.js to configure your router for OpenID Connect.

## Constructors


### `OpenidRouting(configuration, userManager, detector)`

Creates an instance of the class with the given parameter.

Parameters | Type | Description
--- | --- | ---
__configuration__ | [PluginConfiguration](src_plugin-configuration.md) | *the openid plugin configuration*
__userManager__ | `UserManager` | *the openid user manager*
__detector__ | [OpenidSilentLoginDetector](src_openid-silent-login-detector.md) | *the silent login detector*

---

## Methods

### `configureRouter(routerConfiguration)`

![modifier: public](images/badges/modifier-public.png)

Configures the aurelia router with the specific OpenID Connect signin/signout routes.

Parameters | Type | Description
--- | --- | ---
__routerConfiguration__ | `RouterConfiguration` | *the aurelia router configuration*

---

### `signInStrategy(instruction) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Defines the navigation strategy for /signin-oidc route after a signin.

Parameters | Type | Description
--- | --- | ---
__instruction__ | `NavigationInstruction` | *the aurelia router instruction*
__*return*__ | `Promise.<void>` | *the navigation strategy promise*

---

### `silentSignInStrategy(instruction) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Defines the navigation strategy for /signin-oidc route after a silent signin.

Parameters | Type | Description
--- | --- | ---
__instruction__ | `NavigationInstruction` | *the aurelia router instruction*
__*return*__ | `Promise.<void>` | *the navigation strategy promise*

---

### `signOutStrategy(instruction) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Defines the navigation strategy for /signout-oidc route after a signout.

Parameters | Type | Description
--- | --- | ---
__instruction__ | `NavigationInstruction` | *the aurelia router instruction*
__*return*__ | `Promise.<void>` | *the navigation strategy promise*

---

### `getPath(uri) ► string`

![modifier: public](images/badges/modifier-public.png)

Gets the anchor path to the given uri.

Parameters | Type | Description
--- | --- | ---
__uri__ | `string` | *the specified uri*
__*return*__ | `string` | *the path*

---

### `convertUriToAnchor(uri) ► HTMLAnchorElement`

![modifier: public](images/badges/modifier-public.png)

Converts the given uri to an anchor element.

Parameters | Type | Description
--- | --- | ---
__uri__ | `string` | *the specified uri*
__*return*__ | `HTMLAnchorElement` | *the anchor element*

---

### `runAndCompleteNavigationInstruction(logic, navigationInstructionCall)`

![modifier: public](images/badges/modifier-public.png)

Run the func method and complete the router navigation.

Parameters | Type | Description
--- | --- | ---
__logic__ | `function` | *the logic to run before applying navigation instruction*
__navigationInstructionCall__ | `function` | *the navigation instruction call*

---
