# Module `authenticate-step`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)



[Source file](../src/authenticate-step.js)

## Functions

### `isAuthRequired(navigationInstruction, defaultValue) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Determines whether the navigation requires an authenticated user, based on the &#x60;settings.authRequired&#x60;
of the navigated route and of its child routes: the deepest route defining the setting wins,
and the navigation requires authentication as soon as one of its viewports requires it.

Parameters | Type | Description
--- | --- | ---
__navigationInstruction__ | `NavigationInstruction` | *navigation instruction to analyze*
__defaultValue__ | `boolean` | *value used when no route of the navigation defines the setting*
__*return*__ | `boolean` | *true when the navigation requires an authenticated user*

#### Examples

```javascript
// a public faq route in an application requiring authentication by default
{ route: 'faq', name: 'faq', moduleId: PLATFORM.moduleName('views/faq'), settings: { authRequired: false } }
```

---

# Class `AuthenticateStep`

Implements the **router authorize step** that prevents an unauthenticated user from navigating
to a route requiring authentication (see &#x60;isAuthRequired&#x60;).
The user is redirected to the &#x60;loginRoute&#x60; when configured, otherwise the login to the OpenID provider
is started and the user comes back to the requested route once authenticated.

## Examples

```javascript
configuration.addAuthorizeStep(AuthenticateStep);
```

## Constructors


### `AuthenticateStep(connection, configuration)`

Creates an instance of the authenticate step.

Parameters | Type | Description
--- | --- | ---
__connection__ | [Connection](src_connection.md) | *the OpenID Connect user connection*
__configuration__ | [PluginConfiguration](src_plugin-configuration.md) | *the openid plugin configuration*

---

## Methods

### `run(navigationInstruction, next) ► Promise.<any>`

![modifier: public](images/badges/modifier-public.png)

Validates the navigation.

Parameters | Type | Description
--- | --- | ---
__navigationInstruction__ | `NavigationInstruction` | *navigation instruction to validate*
__next__ | `Next` | *navigation pipeline processor*
__*return*__ | `Promise.<any>` | *navigation pipeline result*

---
