import { Logger } from 'oidc-client-ts';
import { inject } from 'aurelia-framework';

import { Connection } from './connection';
import { OpenidSilentLoginDetector } from './openid-silent-login-detector';

/**
 * Implements a custom interceptor that sets OAuth2 bearer token and
 * obtains a new token when expired.
 * Use this class to configure your http client to try a silent login when access token is expired
 * and to add the bearer token.
 * @category public
 */
@inject(Connection, OpenidSilentLoginDetector)
export class Oauth2Interceptor {
  /**
   * Creates an instance of the class with the specified parameters.
   * @param {Connection} connection the OpenID Connect user connection
   * @param {OpenidSilentLoginDetector} detector the silent login detector
   */
  constructor(connection, detector) {
    this._connection = connection;
    this._detector = detector;
  }

  /**
   * Intercepts and handles the request.
   * @param {Request} request the intercepted request
   * @returns {Promise<Request>} the intercepted request
   */
  async request(request) {
    try {
      if (!this._connection.hasValidAccessToken && !this._detector.isSilentLogin()) {
        Logger.info('Oauth2Interceptor.request: expired token, try silent login...');
        await this._connection.trySilentLogin();
      }
      request.headers.set('Authorization', `Bearer ${this._connection.accessToken}`);
      return request;
    } catch (error) {
      Logger.error('Oauth2Interceptor.request: unable to obtain new token', error);
      throw error;
    }
  }
}
