import { inject } from 'aurelia-framework';

import { defaultReconnectPrompt } from './constants';
import { PluginConfiguration } from './plugin-configuration';

/**
 * Defines the user prompt service of the plugin.
 * @category internal
 */
@inject(PluginConfiguration)
export class UserPrompt {
  /**
   * Your user prompt implementation to display when user is expired.
   * The loginFunction parameter is the function to call when user accepts to reconnect.
   * @type {(loginFunction: Function) => void}
   */
  reconnectPrompt;

  /**
   * Creates an instance of the class with the specified parameters.
   * @param {PluginConfiguration} configuration the openid plugin configuration
   */
  constructor(configuration) {
    this.reconnectPrompt = configuration.reconnectPrompt || defaultReconnectPrompt;
  }
}
