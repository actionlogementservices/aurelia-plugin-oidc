/* eslint-disable unicorn/no-null */
import { RedirectToRoute } from 'aurelia-router';

import { AuthenticateStep, isAuthRequired } from '../../src/authenticate-step';

const expectedFragment = 'dossier/123/documents';
const expectedLoginRoute = 'connexion';
const expectedUser = { profile: { name: 'name' } };

/**
 * Creates a navigation instruction with the specified route settings and child instructions by viewport.
 * @param {any} settings route settings
 * @param {Record<string, any>} [children] child navigation instructions by viewport name
 * @param {string} [name] route name
 * @returns {any} navigation instruction
 */
const instruction = (settings, children = {}, name = 'route') => ({
  fragment: expectedFragment,
  config: { name, settings },
  viewPortInstructions: Object.fromEntries(
    Object.entries(children).map(([viewPort, child]) => [viewPort, { childNavigationInstruction: child }])
  )
});

const mockNext = () => {
  const next = jest.fn().mockReturnValue('next');
  next.cancel = jest.fn().mockReturnValue('cancel');
  return next;
};

describe('isAuthRequired()', () => {
  test('returns the default value when no route defines the setting', () => {
    expect(isAuthRequired(instruction({}, { default: instruction(undefined) }))).toBe(false);
    expect(isAuthRequired(instruction({}, { default: instruction(undefined) }), true)).toBe(true);
  });

  test('returns false by default', () => {
    expect(isAuthRequired({ config: {} })).toBe(false);
  });

  test('returns the setting of the route', () => {
    expect(isAuthRequired(instruction({ authRequired: true }))).toBe(true);
    expect(isAuthRequired(instruction({ authRequired: false }), true)).toBe(false);
  });

  test('ignores a setting that is not a boolean', () => {
    expect(isAuthRequired(instruction({ authRequired: 'yes' }))).toBe(false);
  });

  test('applies the setting of a parent route to its child routes', () => {
    expect(isAuthRequired(instruction({ authRequired: true }, { default: instruction({}) }))).toBe(true);
  });

  test('gives precedence to the deepest route defining the setting', () => {
    const publicChild = instruction({ authRequired: true }, { default: instruction({ authRequired: false }) });
    const protectedChild = instruction({ authRequired: false }, { default: instruction({ authRequired: true }) });
    expect(isAuthRequired(publicChild)).toBe(false);
    expect(isAuthRequired(protectedChild)).toBe(true);
  });

  test('requires authentication when one of the viewports requires it', () => {
    const navigationInstruction = instruction(
      {},
      { left: instruction({ authRequired: false }), right: instruction({ authRequired: true }) }
    );
    expect(isAuthRequired(navigationInstruction)).toBe(true);
  });
});

describe('AuthenticateStep', () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      getUser: jest.fn().mockResolvedValue(null),
      loginUser: jest.fn().mockResolvedValue()
    };
  });

  describe('run()', () => {
    test('continues the navigation when the route does not require authentication', async () => {
      const step = new AuthenticateStep(mockConnection, {});
      const next = mockNext();
      expect(await step.run(instruction({}), next)).toBe('next');
      expect(mockConnection.getUser).not.toHaveBeenCalled();
    });

    test('continues the navigation when the user is authenticated', async () => {
      mockConnection.getUser.mockResolvedValue(expectedUser);
      const step = new AuthenticateStep(mockConnection, {});
      const next = mockNext();
      expect(await step.run(instruction({ authRequired: true }), next)).toBe('next');
    });

    test('requires authentication on the routes without setting when authRequiredByDefault is true', async () => {
      const step = new AuthenticateStep(mockConnection, { authRequiredByDefault: true });
      const next = mockNext();
      await step.run(instruction({}), next);
      expect(next).not.toHaveBeenCalled();
      expect(next.cancel).toHaveBeenCalled();
    });

    test('redirects an unauthenticated user to the login route', async () => {
      const step = new AuthenticateStep(mockConnection, { loginRoute: expectedLoginRoute });
      const next = mockNext();
      expect(await step.run(instruction({ authRequired: true }), next)).toBe('cancel');
      const redirect = next.cancel.mock.calls[0][0];
      expect(redirect).toBeInstanceOf(RedirectToRoute);
      expect(redirect.route).toBe(expectedLoginRoute);
      expect(mockConnection.loginUser).not.toHaveBeenCalled();
    });

    test('always continues the navigation to the login route', async () => {
      const step = new AuthenticateStep(mockConnection, {
        loginRoute: expectedLoginRoute,
        authRequiredByDefault: true
      });
      const next = mockNext();
      expect(await step.run(instruction({}, {}, expectedLoginRoute), next)).toBe('next');
    });

    test('starts the login of an unauthenticated user with the requested route when no login route is defined', async () => {
      const step = new AuthenticateStep(mockConnection, {});
      const next = mockNext();
      expect(await step.run(instruction({ authRequired: true }), next)).toBe('cancel');
      expect(mockConnection.loginUser).toHaveBeenCalledWith(expectedFragment);
      expect(next.cancel).toHaveBeenCalledWith();
    });
  });
});
