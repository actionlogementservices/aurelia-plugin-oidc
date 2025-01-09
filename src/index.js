/**
 * Defines the Aurelia plugin entry point.
 * @module
 * @category internal
 */

import { UserManager } from 'oidc-client-ts';

import { PluginConfiguration } from './plugin-configuration';

/** @typedef {import('aurelia-framework').FrameworkConfiguration} FrameworkConfiguration */

/**
 * Configures the plugin.
 * @param {FrameworkConfiguration} aurelia the aurelia framework configuration
 * @param {() => PluginConfiguration} pluginCallback the plugin callback
 */
function configure(aurelia, pluginCallback) {
  const pluginConfiguration = pluginCallback();
  aurelia.container.registerInstance(UserManager, new UserManager(pluginConfiguration.userManagerSettings));
  aurelia.container.registerInstance(PluginConfiguration, pluginConfiguration);
  aurelia.container.registerInstance(Window, globalThis);
}

export { configure };

export { PluginConfiguration } from './plugin-configuration';
export { Oauth2Interceptor } from './oauth2-interceptor';
export { OpenidRouting } from './openid-routing';
export { Connection } from './connection';
