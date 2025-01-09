import { inject } from 'aurelia-framework';

/**
 * Implements the logic to find out the correct OpenID Connect flow.
 * @category internal
 */
@inject(Window)
export class OpenidSilentLoginDetector {
  /**
   * Creates an instance of the class with the given parameter.
   * @param {Window} browserWindow the navigator windows object
   */
  constructor(browserWindow) {
    this._window = browserWindow;
  }

  /**
   * Is a silent login in progress?
   * @returns {boolean} true if a silen login is currently in progress
   */
  isSilentLogin() {
    try {
      return this._window.self !== this._window.top;
    } catch {
      return true;
    }
  }
}
