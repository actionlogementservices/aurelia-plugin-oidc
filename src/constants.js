/**
 * Defines the Aurelia plugin constants.
 * @module
 * @category internal
 */

/** @typedef {import('aurelia-router').NavigationInstruction} NavigationInstruction */
/** @typedef {import('oidc-client-ts').UserProfile} UserProfile */
/** @typedef {import('oidc-client-ts').ErrorResponse} ErrorResponse */

/**
 * Gets the useful part of the navigation instruction for redirecting within the aurelia application.
 * @param {NavigationInstruction} instruction the navigation instruction
 * @returns {string} the useful part of the navigation instruction
 */
export const getCurrentRouteInfo = instruction => instruction?.fragment;

/**
 * The routes definitions to add for OpenID Connect.
 */
export const ROUTES = {
  signinRedirectCallback: { name: 'signinRedirectCallback', url: 'signin-oidc' },
  signoutRedirectCallback: { name: 'signoutRedirectCallback', url: 'signout-oidc' }
};

/**
 * Defines the default reconnection prompt based on the Window.confirm() method.
 * @param {Function} loginFunction the internal reconnection logic to trigger in your prompt
 * @returns {void}
 */
export const defaultReconnectPrompt = loginFunction => {
  // eslint-disable-next-line no-alert
  if (confirm('Session expired. Reconnect?')) loginFunction();
};

/**
 * Defines the default claim that represents the user identifier.
 * The default claim is "name".
 * @param {UserProfile | {name: string}} profile the user profile containing claims
 * @returns {string} the user identifier
 */
export const defaultUserIdClaimSelector = profile => profile.name;

/**
 * Defines the default silent login error code that triggers a reconnection prompt.
 * @param {ErrorResponse} errorReponse the error object returned by the identity provider
 * @returns {boolean} the condition on error response object to trigger the complete login
 */
export const defaultLoginRequiredSelector = errorReponse => errorReponse.error === 'interaction_required';

/**
 * Defines the default user in simulation mode.
 * @type {SimulatedUser}
 */
export const defaultSimulationUser = {
  profile: { name: 'Test User' },
  expired: false,
  access_token: '0123456789'
};

/**
 * Defines the default onError callback (do nothing).
 * @param {ErrorResponse} errorReponse the error object returned by the identity provider
 * @returns {void}
 */
export const defaultOnError = errorReponse => {};
