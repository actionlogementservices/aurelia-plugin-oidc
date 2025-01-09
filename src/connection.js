/* eslint-disable unicorn/no-null */
import { inject, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserManager, Logger } from 'oidc-client-ts';

import {
  getCurrentRouteInfo,
  defaultUserIdClaimSelector,
  defaultSimulationUser,
  defaultLoginRequiredSelector
} from './constants';
import { UserPrompt } from './user-prompt';
import { PluginConfiguration } from './plugin-configuration';

/** @typedef {import('oidc-client-ts').User} User */
/** @typedef {import('oidc-client-ts').ExtraSigninRequestArgs} ExtraSigninRequestArgs */
/** @typedef {import('oidc-client-ts').ExtraSignoutRequestArgs} ExtraSignoutRequestArgs */
/** @typedef {import('oidc-client-ts').UserProfile} UserProfile */
/** @typedef {import('oidc-client-ts').ErrorResponse} ErrorResponse */

/**
 * Provides an encapsulation of the OpenID Connect user connection.
 * @category public
 */
@inject(Router, PluginConfiguration, UserManager, UserPrompt)
export class Connection {
  /**
   * Creates an instance of the class with the given parameter.
   * @param {Router} router the aurelia router
   * @param {PluginConfiguration} configuration the openid plugin configuration
   * @param {UserManager} userManager the openid user manager
   * @param {UserPrompt} userPrompt the user prompt to confirm reconnection
   */
  constructor(router, configuration, userManager, userPrompt) {
    this._user = null;
    this._router = router;
    this._userManager = userManager;
    this.simulation = configuration.simulation === true;
    this._simulationUser = configuration.simulationUser || defaultSimulationUser;
    this._extraQueryParameters = configuration?.userManagerSettings?.extraQueryParams;
    if (!this.simulation) this.observeUser(user => this._setUser(user));
    this._reconnectPrompt = userPrompt.reconnectPrompt;
    this._userIdClaimSelector = configuration.userIdClaimSelector || defaultUserIdClaimSelector;
    this._loginRequiredSelector = configuration.loginRequiredSelector || defaultLoginRequiredSelector;
  }

  /**
   * Defines a callback called when user connection changes.
   * @param {(user: User) => void} userfunc a callback called when user connection changes
   * @returns {Promise<void>} the promise that retrieves user
   */
  async observeUser(userfunc) {
    this._userManager.events.addUserLoaded(user => userfunc(user));
    this._userManager.events.addUserUnloaded(user => userfunc(user));
    return this._userManager.getUser().then(user => userfunc(user));
  }

  /**
   * Retrieves the connected user.
   * @returns {Promise<User>} the connected user
   */
  async getUser() {
    return this._userManager.getUser();
  }

  /**
   * Initiates the OpenID Connect user connection.
   * @param {string} [route] the aurelia route name to be redirected after login - if not specified this will be the current route
   * @param {ExtraSigninRequestArgs} options optional options passed to underlying oidc signin method
   * @returns {Promise<void>}
   */
  async loginUser(route, options = {}) {
    if (this.simulation) {
      this._setUser(this._simulationUser);
      return;
    }
    const redirectRoute = route || getCurrentRouteInfo(this._router.currentInstruction);
    try {
      Logger.info(`Connection.loginUser: starting signin redirection with ${redirectRoute}...`);
      await this._userManager.signinRedirect({ state: redirectRoute, ...options });
    } catch (error) {
      Logger.error('Connection.loginUser: unable to login', error);
      throw error;
    }
  }

  /**
   * Initiates the OpenID Connect user deconnection.
   * @param {string} [route] the aurelia route name to be redirected after logout - if not specified this will be the current route
   * @param {ExtraSignoutRequestArgs} options optional options passed to underlying oidc signout method
   * @returns {Promise<void>}
   */
  async logoutUser(route, options = {}) {
    if (this.simulation) {
      this._setUser(null);
      return;
    }
    const noEndSessionEndpoint = this._userManager.settings?.metadata?.end_session_endpoint === undefined;
    if (noEndSessionEndpoint) {
      await this._userManager.removeUser();
      return;
    }
    const redirectRoute = route || getCurrentRouteInfo(this._router.currentInstruction);
    try {
      Logger.info(`Connection.logoutUser: starting signout redirection with ${redirectRoute}...`);
      await this._userManager.signoutRedirect({ state: redirectRoute, ...options });
    } catch (error) {
      Logger.error('Connection.logoutUser: unable to logout', error);
      throw error;
    }
  }

  /**
   * Initiates the OpenID Connect silent user connection and displays the reconnect prompt if asked by the provider.
   * @param {string} [route] the aurelia route name to be redirected in case of reconnnect prompt - if not specified this will be the current route
   * @returns {Promise<void>}
   */
  async trySilentLogin(route) {
    if (this.simulation) {
      this._setUser(this._simulationUser);
      return;
    }
    const redirectRoute = route || getCurrentRouteInfo(this._router.currentInstruction);
    try {
      this._inProgress = true;
      Logger.info(`Connection.trySilentLogin: starting silent signin redirection...`);
      // remove max_age if present from extraQueryparams as it breaks silent login
      let options = {};
      if (this._extraQueryParameters) {
        // eslint-disable-next-line unicorn/prevent-abbreviations
        const extraQueryParams = { ...this._extraQueryParameters };
        if (Object.prototype.hasOwnProperty.call(extraQueryParams, 'max_age'))
          delete extraQueryParams.max_age;
        options = { extraQueryParams };
      }
      await this._userManager.signinSilent(options);
      this._inProgress = false;
    } catch (error) {
      this._inProgress = false;
      Logger.warn(`Connection.trySilentLogin: silent signin error: ${error}`);
      if (this._loginRequiredSelector(error)) {
        Logger.debug(`Connection.trySilentLogin: login required intercepted => show reconnect prompt`);
        this._reconnectPrompt(() => this.loginUser(redirectRoute));
      } else {
        Logger.error('Connection.trySilentLogin: unable to login silently', error);
        throw error;
      }
    }
  }

  /**
   * Sets the connected user entity.
   * @param {User | SimulatedUser} user the OpenID Connect user
   */
  _setUser(user) {
    this._user = user;
  }

  /**
   * Is silent login in progress?
   * @type {boolean}
   */
  @computedFrom('_inProgress')
  get inProgress() {
    return this._inProgress;
  }

  /**
   * The user identifier. It may be undefined.
   * @type {string}
   */
  @computedFrom('_user')
  get userId() {
    return this._user?.profile ? this._userIdClaimSelector(this._user.profile) : '';
  }

  /**
   * Is the user currently connected with an eventually expired access token?
   * @type {boolean}
   */
  @computedFrom('_user')
  get isUserLoggedIn() {
    return this._user !== null && this._user !== undefined;
  }

  /**
   * Has the user a valid access token?
   * @type {boolean}
   */
  @computedFrom('_user')
  get hasValidAccessToken() {
    return (
      this._user !== null &&
      this._user !== undefined &&
      this._user.expired === false &&
      !!this._user.access_token
    );
  }

  /**
   * The user access token. The token may be expired. Check hasValidAccessToken property before.
   * @type {string}
   */
  @computedFrom('_user')
  get accessToken() {
    return this._user?.access_token;
  }

  /**
   * The display name of the user. The 'name' claim is used to provide this information.
   * @type {string}
   */
  @computedFrom('_user')
  get userName() {
    return this._user?.profile?.name;
  }

  /**
   * The profile of the user. It contains the claims provided by the identity provider.
   * @type {UserProfile | {name: string}}
   */
  @computedFrom('_user')
  get profile() {
    return this._user?.profile;
  }

  /**
   * The number of seconds the access token has remaining.
   * @type {number}
   */
  @computedFrom('_user')
  get expiresIn() {
    return this._user?.expires_in;
  }
}
