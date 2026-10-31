[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm package](https://img.shields.io/npm/v/%40actionlogementservices%2Faurelia-plugin-oidc)](https://www.npmjs.com/package/@actionlogementservices/aurelia-plugin-oidc)
![Coverage Badge](https://img.shields.io/badge/Coverage-100%25-green.svg)

# @actionlogementservices/aurelia-plugin-oidc

An Aurelia plugin based on the library [oidc-client-ts](https://github.com/authts/oidc-client-ts) and replacement for the previous and now archived [aurelia-kis-oidc](https://github.com/kisssdev/aurelia-kis-oidc) repository. 

It adapts the **[OpenID Connect Authorization Code flow with PKCE](https://github.com/authts/oidc-client-ts/blob/main/docs/protocols/authorization-code-grant-with-pkce.md)** to the Aurelia router in a 'keep it simple' way. Note that support of **Implicit flow has been dropped** in oidc-client-ts. If you rely on this particular flow you need to keep using the aurelia-kis-oidc plugin. Otherwise see the **[Migration from aurelia-kis-oidc](#Migration-from-aurelia-kis-oidc)** guide to adapt your code.

The plugin is fully [documented](./doc/toc.md) and fully tested.


## Description

- After a successful login to the OpenID provider, the access token is automatically attached to the http client, so that further calls to an OAuth2 protected web api will be authenticated.

- When a web api call is made, the plugin will check the access token validity. If the token has expired, the plugin will try to sign in the user silently in order to get a new access token.

- If the user has a valid browser session to the OpenID provider, a new access token is retrieved, and the web api is called transparently.

- If the silent login is not possible the user is prompted to login to the OpenID provider.

- After the successful login, the user is redirected to his original page.

## Migration to v2

- The **simulation mode** has been removed: the __simulation__ and __simulationUser__ configuration properties no longer exist and the `Connection` class no longer has a `simulation` property. Use a real OpenID provider (or mock the `Connection` class in your tests).

- The new `AuthenticateStep` replaces the authenticate steps implemented by the applications: see [Protected routes](#protected-routes).

## Migration from aurelia-kis-oidc

- The configuration of the plugin must be changed from

  ```javascript
  function configureOpenidPlugin(aurelia) {
    Log.level = 1;       // define the log level : 4: DEBUG, 3: INFO, 2: WARN, 1: ERROR, 0: NONE
    Log.logger = logger; // set the logger
    return {
      userIdClaimSelector: profile => profile.emails[0],
      reconnectPrompt: loginFunc =>
        iziToast.show({
          title: 'Session expired',
          message: 'Please reconnect',
          buttons: [[`<button>Reconnect</button>`, (instance, toast) => loginFunc(), true]]
        }),
      userManagerSettings: {
        // your oidc-client-js configuration
        ...
        stateStore: new WebStorageStateStore({
          store: globalThis.sessionStorage
        }),
        userStore: new WebStorageStateStore({
          store: globalThis.sessionStorage
        })
      }
    }
  }
  ```

  to

  ```javascript
  function configureOpenidPlugin(aurelia) {
    const logger = LogManager.getLogger('aurelia-plugin-oidc');
    const pluginConfiguration = new PluginConfiguration({
      userIdClaimSelector: profile => profile.emails[0],
      reconnectPrompt: loginFunc =>
        iziToast.show({
          title: 'Session expired',
          message: 'Please reconnect',
          buttons: [[`<button>Reconnect</button>`, (instance, toast) => loginFunc(), true]]
        }),
      userManagerSettings: {
        // your oidc-client-js configuration
        ...
      }
    });
    pluginConfiguration
      .setLogLevel(1)    // define the log level : 4: DEBUG, 3: INFO, 2: WARN, 1: ERROR, 0: NONE
      .setLogger(logger) // set the logger
      .setStorage(globalThis.sessionStorage); // set the user and state store of the userManagerSettings
  }
  ```

## Features

- This plugin registers dynamically two routes (__signin-oidc__ and __signout-oidc__) within your application in order to implement the OpenID Connect Implicit Client protocol.

- It implements an **http interceptor** that deals with silent login and bearer token.

- It is possible to redirect the application on a specific route based on the presence of a **specific claim** in the user profile (See the __redirectsOnClaim__ configuration property).

- It implements a **router authorize step** that protects the routes requiring an authenticated user (See [Protected routes](#protected-routes)).

## Installation

1. **Install** the plugin:

    ```node
    npm install @actionlogementservices/aurelia-plugin-oidc
    ```

1. **Register** the plugin in aurelia:

    ```javascript
    // in your main.js or main.ts
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .plugin(PLATFORM.moduleName('@actionlogementservices/aurelia-plugin-oidc'), () => configureOpenidPlugin(aurelia))
    ```

1. **Configure** the plugin:

    ```javascript
    function configureOpenidPlugin(aurelia) {
      const logger = LogManager.getLogger('aurelia-plugin-oidc');
      const pluginConfiguration = new PluginConfiguration({
        userIdClaimSelector: profile => profile.emails[0],
        reconnectPrompt: loginFunc =>
          iziToast.show({
            title: 'Session expired',
            message: 'Please reconnect',
            buttons: [[`<button>Reconnect</button>`, (instance, toast) => loginFunc(), true]]
          }),
        userManagerSettings: {
          // your oidc-client-js configuration
          ...
        }
      });
      pluginConfiguration
        .setLogLevel(1)    // define the log level : 4: DEBUG, 3: INFO, 2: WARN, 1: ERROR, 0: NONE
        .setLogger(logger) // set the logger
        .setStorage(globalThis.sessionStorage); // set the user and state store of the userManagerSettings
    }
    ```

1. Connect the router and the httpclient with the plugin:

    ```javascript
    // in your app.js or app.ts
    import { inject } from 'aurelia-framework';
    import { HttpClient } from 'aurelia-fetch-client';
    import { OpenidRouting, Oauth2Interceptor } from '@actionlogementservices/aurelia-plugin-oidc';

    @inject(OpenidRouting, HttpClient, Oauth2Interceptor)
    export class App {

      constructor(openidRouting, client, authInterceptor) {
        this.openidRouting = openidRouting;
        this.configureHttpClient(client, authInterceptor);
      }

      configureRouter(configuration, router) {
        ...
        // required
        configuration.options.pushState = true;
        // add dynamically routes for OpenID Connect
        this.openidRouting.configureRouter(configuration);
        ...
      }

      configureHttpClient(client, authInterceptor) {
        return client.configure(config => {
          config
            .withDefaults({
              headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Accept': 'application/json'
              },
              credentials: 'include',
              mode: 'cors'
            })
            .rejectErrorResponses()
            .withInterceptor(authInterceptor)
        });
      }
    ```

## Protected routes

Register the `AuthenticateStep` in the application router, and set `settings.authRequired` on the routes:

```javascript
// in your app.js
import { AuthenticateStep, OpenidRouting } from '@actionlogementservices/aurelia-plugin-oidc';

configureRouter(configuration, router) {
  configuration.map([
    { route: '', name: 'accueil', moduleId: PLATFORM.moduleName('views/accueil') },
    { route: 'dossier/:id', name: 'dossier', moduleId: PLATFORM.moduleName('views/dossier/dossier-router'), settings: { authRequired: true } },
    { route: 'faq', name: 'faq', moduleId: PLATFORM.moduleName('views/faq'), settings: { authRequired: false } }
  ]);
  configuration.addAuthorizeStep(AuthenticateStep);
  this.openidRouting.configureRouter(configuration);
}
```

When an unauthenticated user navigates to a route requiring authentication, the step:

- redirects the user to the __loginRoute__ when it is configured,
- otherwise starts the login to the OpenID provider, and the user comes back to the requested route once authenticated.

The `settings.authRequired` value of a route:

| Value       | Meaning |
| ----------- | ------- |
| `true`      | the route requires an authenticated user |
| `false`     | the route is public (faq, contact...) |
| not defined | the __authRequiredByDefault__ configuration property applies (`false` by default) |

The setting applies to the child routes of the route (child routers). The **deepest route defining the setting wins**: a public route can be nested in a protected route, and the other way round. When the navigation involves several viewports, it requires authentication as soon as one of them requires it.

The `isAuthRequired(navigationInstruction, defaultValue)` function implements this logic: it is exported for the other router steps, like the `AuthorizeStep` of [aurelia-plugin-authorization](https://github.com/actionlogementservices/aurelia-plugin-authorization).

With **aurelia-plugin-authorization**, register the `AuthenticateStep` **before** the `AuthorizeStep`, so that an unauthenticated user is sent to the login rather than to the home route:

```javascript
configuration.addAuthorizeStep(AuthenticateStep);
configuration.addAuthorizeStep(AuthorizeStep);
```

## User interface

This plugin does not come with any user interface element but it provides a [Connection](./doc/src_connection.md) class that encapsulates the OpenID Connect user connection. Just inject the Connection class within your viewmodel and bind your html elements to it.

```javascript
//login.js
import { inject } from 'aurelia-framework';
import { Connection } from '@actionlogementservices/aurelia-plugin-oidc';

@inject(Connection)
export class Login {
  constructor(connection) {
    this.connection = connection;
  }
```

```html
<!-- login.html -->
<template>
  <!-- a login button -->
  <button click.trigger="connection.loginUser()">
    Login
  </button>
  <!-- a conditional lougout link with user name -->
  <a if.bind="connection.isUserLoggedIn" click.trigger="connection.logoutUser()">
    Logout ${connection.userId}
  </a>
</template>
```

You can change the claim that is used to represent the identifier of the user (property userId): see the __userIdClaimSelector__ configuration property.

You can also change the user prompt interface when the session has expired: see the __reconnectPrompt__ configuration property.

## Configuration options

You can define specific options in the configuration returned by the __configureOpenidPlugin__ function.

### `userIdClaimSelector`

Function that defines the profile claim used as user identifier.

_Example:_

 ```javascript
 /**
 * Defines the profile claim used as user identifier.
 * @param {Object} profile - the user profile containing claims
 * @return {string} the user identifier
 */
const userIdClaimSelector = profile => profile.emails[0];
 ```

If you do not define this option, the default claim used is the __name__ claim.

### `reconnectPrompt`

_Function that defines the user prompt to reconnect the session when it is expired._

By default, it displays the native browser prompt.

_Here's an example with the [iziToast](https://github.com/marcelodolza/iziToast) component:_

 ```javascript
/**
 * Implements the reconnect prompt with izitoast component.
 * @param {I18N} i18n -  the translation plugin
 * @return {function} the function called to reconnect the session
 */
const reconnectPrompt = loginFunc => {
  iziToast.show({
    theme: 'dark',
    title: 'Session expired!',
    message: 'Please reconnect...',
    buttons: [[`<button>Reconnect</button>`, (instance, toast) => loginFunc(), true]]
  });
};
```

### `loginRequiredSelector`

To determine that the silent login is not possible the OpenID provider will return an error. The plugin must handle the correct error code in order to show the reconnect prompt. The __loginRequiredSelector__ function defines this code analysis.
The default function is the following (which is what Microsoft Azure B2C authentication currently returns when silent login is no more available):

```javascript
error => error.error === 'interaction_required';
```

You can customize it. For instance this is the function I use for an application authenticated by Azure Active Directory (and it should be the same for Azure B2B authentication):

```javascript
error => error.error === 'login_required';
```

### `redirectsOnClaim`

Sometimes you want to redirect the router to a specific route after the login when a special claim is present.

For instance, with __Azure B2C__ there is a special claim when the user has just created his account.

You can use the __redirectsOnClaim__ function for that.

_Example:_

 ```javascript
 /**
 * Defines the redirect route based on specific profile claims.
 * @param {Object} profile - the user profile containing claims
 * @return {string} the route name or undefined
 */
 const redirectsOnClaim = profile => {
   // redirect newly created users to the settings view
   if (profile?.newUser) return 'settings';
 };
 ```

### `loginRoute`

Name of the route where the `AuthenticateStep` redirects an unauthenticated user navigating to a route requiring authentication. This route is always reachable.

When it is not defined, the step starts the login to the OpenID provider and the user comes back to the requested route once authenticated.

### `authRequiredByDefault`

Defines whether the routes without `settings.authRequired` require authentication (default `false`). Set it to `true` when most of the routes are protected, and mark the public routes with `settings: { authRequired: false }`.

### `onError`

Sometimes the oicd provider may return an error during the response callback.

You can use the __onError__ callback to retrieve the error.

_Example:_

 ```javascript
 const onError = error => {
   // for instance for errors returned by Azure AD
   console.log(error.error_description);
 };
 ```

### `userManagerSettings`

This object is the exact configuration object of the openid-client-ts library.

See [oidc-client-ts documentation](https://github.com/authts/oidc-client-ts/blob/main/docs/index.md).

The __redirect_uri__ must be:
`https://whatever_your_aurelia_app_url/signin-oidc`

If you specify __post_logout_redirect_uri__ it should be:
`https://whatever_your_aurelia_app_url/signout-oidc`

## Project documentation

The project documentation has been generated with jsdoc and the [kis-jsdoc-plugin](https://github.com/kisssdev/kis-jsdoc-plugin).

Check the [table of content](./doc/toc.md).

## Release

The package is published on npm by the `Release` GitHub workflow, with npm trusted publishing (no npm token is stored in GitHub):

1. In your pull request, bump the version with `npm run bump` (updates `package.json` and `package-lock.json` only).
1. When the pull request is merged on `main`, the workflow runs the tests and **stages** the new version on npm.
   Prerelease versions (e.g. `2.1.0-0`) are staged with the `next` dist-tag.
1. The workflow creates a draft GitHub release and an issue assigned to the person who merged, as a reminder to:
   - approve the staged version in the **Staged Packages** tab of the [npm package](https://www.npmjs.com/package/@actionlogementservices/aurelia-plugin-oidc) (2FA required),
   - publish the draft GitHub release, which creates the git tag,
   - close the issue.

If the staged version is rejected, delete the draft release and close the issue.
