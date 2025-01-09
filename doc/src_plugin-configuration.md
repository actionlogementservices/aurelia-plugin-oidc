# Module `plugin-configuration`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)



[Source file](..\src\plugin-configuration.js)

# Class `PluginConfiguration`

Defines the configuration for the openid plugin.

## Constructors


### `PluginConfiguration(options)`



Parameters | Type | Description
--- | --- | ---
__options__ | `PluginOptions` | *options to configure the plugin*

---

## Methods

### `setLogger(logger) ► PluginConfiguration`

![modifier: public](images/badges/modifier-public.png)

Defines the plugin logger.

Parameters | Type | Description
--- | --- | ---
__logger__ | `ILogger` | *the plugin logger*
__*return*__ | [PluginConfiguration](src_plugin-configuration.md) | *the plugin configuration*

---

### `setLogLevel(logLevel) ► PluginConfiguration`

![modifier: public](images/badges/modifier-public.png)

Defines the plugin logging level.
4: DEBUG, 3: INFO, 2: WARN, 1: ERROR, 0: NONE

Parameters | Type | Description
--- | --- | ---
__logLevel__ | `number` | *the plugin logging level*
__*return*__ | [PluginConfiguration](src_plugin-configuration.md) | *the plugin configuration*

---

### `setStorage(store) ► PluginConfiguration`

![modifier: public](images/badges/modifier-public.png)

Defines the storage for storing user and state.

Parameters | Type | Description
--- | --- | ---
__store__ | `Storage` | *the backend store*
__*return*__ | [PluginConfiguration](src_plugin-configuration.md) | *the plugin configuration*

---

## Members

Name | Type | Description
--- | --- | ---
__simulation__ | `boolean` | *Activates the simulation mode where the login/logout is only simulated. You can define a related simulationUser.*
__simulationUser__ | `SimulatedUser` | *User object that defines the connected user when simulation mode is enable.*
__userIdClaimSelector__ | `((profile: UserProfile \| {name: string}) => string)` | *Function that defines the profile claim used to represent user identifier.*
__loginRequiredSelector__ | `((errorResponse: ErrorResponse) => boolean)` | *Function that defines the silent login failure analysis to determine that a complete login is required.*
__redirectsOnClaim__ | `((profile: UserProfile) => string)` | *Function that defines the redirect route name based on the presence of specific profile claims.*
__reconnectPrompt__ | `((loginFunction: Function) => void)` | *Function that defines the reconnection prompt that will be displayed when a new connection is required.
The loginFunction parameter is the function to call when user accepts to reconnect.*
__userManagerSettings__ | `UserManagerSettings` | *Configuration object of the underlying oidc-client-js library. See https://github.com/IdentityModel/oidc-client-js/wiki for details.*
__onError__ | `((errorResponse: ErrorResponse) => void)` | *Callback function called when the oidc provider returns an error.*
