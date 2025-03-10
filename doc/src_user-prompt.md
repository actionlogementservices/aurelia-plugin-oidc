# Module `user-prompt`

![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)



[Source file](..\src\user-prompt.js)

# Class `UserPrompt`

Defines the user prompt service of the plugin.

## Constructors


### `UserPrompt(configuration)`

Creates an instance of the class with the specified parameters.

Parameters | Type | Description
--- | --- | ---
__configuration__ | [PluginConfiguration](src_plugin-configuration.md) | *the openid plugin configuration*

---

## Members

Name | Type | Description
--- | --- | ---
__reconnectPrompt__ | `(loginFunction: Function) => void` | *Your user prompt implementation to display when user is expired.
The loginFunction parameter is the function to call when user accepts to reconnect.*
