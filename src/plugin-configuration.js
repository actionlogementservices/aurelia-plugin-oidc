import { Log, WebStorageStateStore } from 'oidc-client-ts';

/** @typedef {import('oidc-client-ts').User} User */
/** @typedef {import('oidc-client-ts').UserProfile} UserProfile */
/** @typedef {import('oidc-client-ts').UserManagerSettings} UserManagerSettings */
/** @typedef {import('oidc-client-ts').ErrorResponse} ErrorResponse */
/** @typedef {import('oidc-client-ts').ILogger} ILogger */
/** @typedef {Mandatory<PluginConfiguration, 'userManagerSettings'>} PluginOptions */

/**
 * Defines the configuration for the openid plugin.
 * @category public
 */
export class PluginConfiguration {
  /**
   * @param {PluginOptions} options options to configure the plugin
   */
  constructor(options) {
    Object.assign(this, { ...options });
  }

  /**
   * Defines the plugin logger.
   * @param {ILogger} logger the plugin logger
   * @returns {PluginConfiguration} the plugin configuration
   */
  setLogger(logger) {
    Log.setLogger(logger);
    return this;
  }

  /**
   * Defines the plugin logging level.
   * 4: DEBUG, 3: INFO, 2: WARN, 1: ERROR, 0: NONE
   * @param {number} logLevel the plugin logging level
   * @returns {PluginConfiguration} the plugin configuration
   */
  setLogLevel(logLevel) {
    Log.setLevel(logLevel);
    return this;
  }

  /**
   * Defines the storage for storing user and state.
   * @param {Storage} store the backend store
   * @returns {PluginConfiguration} the plugin configuration
   */
  setStorage(store) {
    const stateStore = new WebStorageStateStore({ store });
    const userStore = new WebStorageStateStore({ store });
    Object.assign(this.userManagerSettings, { stateStore, userStore });
    return this;
  }

  /**
   * Activates the simulation mode where the login/logout is only simulated. You can define a related simulationUser.
   * @type {boolean | undefined}
   */
  simulation;

  /**
   * User object that defines the connected user when simulation mode is enable.
   * @type {SimulatedUser | undefined}
   */
  simulationUser;

  /**
   * Function that defines the profile claim used to represent user identifier.
   * @type {((profile: UserProfile | {name: string}) => string)}
   */
  userIdClaimSelector;

  /**
   * Function that defines the silent login failure analysis to determine that a complete login is required.
   * @type {((errorResponse: ErrorResponse) => boolean)}
   */
  loginRequiredSelector;

  /**
   * Function that defines the redirect route name based on the presence of specific profile claims.
   * @type {((profile: UserProfile) => string)}
   */
  redirectsOnClaim;

  /**
   * Function that defines the reconnection prompt that will be displayed when a new connection is required.
   * The loginFunction parameter is the function to call when user accepts to reconnect.
   * @type {((loginFunction: Function) => void)}
   */
  reconnectPrompt;

  /**
   * Configuration object of the underlying oidc-client-js library. See https://github.com/IdentityModel/oidc-client-js/wiki for details.
   * @type {UserManagerSettings}
   */
  userManagerSettings;

  /**
   * Callback function called when the oidc provider returns an error.
   * @type {((errorResponse: ErrorResponse) => void)}
   */
  onError;
}
