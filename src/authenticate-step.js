import { inject } from 'aurelia-framework';
import { RedirectToRoute } from 'aurelia-router';

import { Connection } from './connection';
import { getCurrentRouteInfo } from './constants';
import { PluginConfiguration } from './plugin-configuration';

/** @typedef {import('aurelia-router').NavigationInstruction} NavigationInstruction */
/** @typedef {import('aurelia-router').Next} Next */

/**
 * Determines whether the navigation requires an authenticated user, based on the `settings.authRequired`
 * of the navigated route and of its child routes: the deepest route defining the setting wins,
 * and the navigation requires authentication as soon as one of its viewports requires it.
 * @example
 * // a public faq route in an application requiring authentication by default
 * { route: 'faq', name: 'faq', moduleId: PLATFORM.moduleName('views/faq'), settings: { authRequired: false } }
 * @param {NavigationInstruction} navigationInstruction navigation instruction to analyze
 * @param {boolean} [defaultValue] value used when no route of the navigation defines the setting
 * @returns {boolean} true when the navigation requires an authenticated user
 * @category public
 */
export function isAuthRequired(navigationInstruction, defaultValue = false) {
  const settingValue = navigationInstruction.config?.settings?.authRequired;
  const value = typeof settingValue === 'boolean' ? settingValue : defaultValue;
  const childInstructions = Object.values(navigationInstruction.viewPortInstructions ?? {})
    .map(viewPortInstruction => viewPortInstruction.childNavigationInstruction)
    .filter(Boolean);
  if (childInstructions.length === 0) return value;
  return childInstructions.some(childInstruction => isAuthRequired(childInstruction, value));
}

/**
 * Implements the **router authorize step** that prevents an unauthenticated user from navigating
 * to a route requiring authentication (see `isAuthRequired`).
 * The user is redirected to the `loginRoute` when configured, otherwise the login to the OpenID provider
 * is started and the user comes back to the requested route once authenticated.
 * @example
 * configuration.addAuthorizeStep(AuthenticateStep);
 * @category public
 */
@inject(Connection, PluginConfiguration)
export class AuthenticateStep {
  /**
   * Creates an instance of the authenticate step.
   * @param {Connection} connection the OpenID Connect user connection
   * @param {PluginConfiguration} configuration the openid plugin configuration
   */
  constructor(connection, configuration) {
    this._connection = connection;
    this._configuration = configuration;
  }

  /**
   * Validates the navigation.
   * @param {NavigationInstruction} navigationInstruction navigation instruction to validate
   * @param {Next} next navigation pipeline processor
   * @returns {Promise<any>} navigation pipeline result
   */
  async run(navigationInstruction, next) {
    const { loginRoute, authRequiredByDefault } = this._configuration;
    // the login route is always reachable, otherwise the redirection would loop
    if (loginRoute && navigationInstruction.config?.name === loginRoute) return next();
    if (!isAuthRequired(navigationInstruction, authRequiredByDefault === true)) return next();
    // the stored user is read rather than the connection state, which may not be loaded yet at application start
    const user = await this._connection.getUser();
    if (user) return next();
    if (loginRoute) return next.cancel(new RedirectToRoute(loginRoute));
    await this._connection.loginUser(getCurrentRouteInfo(navigationInstruction));
    return next.cancel();
  }
}
