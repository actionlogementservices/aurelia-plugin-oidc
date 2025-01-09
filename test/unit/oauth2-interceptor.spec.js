/* eslint-disable unicorn/error-message */
/* eslint-disable no-empty */
// mock oidc Log function
jest.mock('oidc-client-ts');
import { Logger } from 'oidc-client-ts';

import { Oauth2Interceptor } from '../../src/oauth2-interceptor';

const expectedAccessToken = '1234';
const expectedHeaderName = 'Authorization';
const expectedHeaderValue = `Bearer ${expectedAccessToken}`;

describe('Oauth2Interceptor', () => {
  beforeEach(() => {});

  describe('request()', () => {
    test('triggers trySilentLogin if token not valid and previous trySilentLogin not running, then sets bearer token', async () => {
      const mockConnection = {
        accessToken: expectedAccessToken,
        hasValidAccessToken: false,
        trySilentLogin: jest.fn()
      };
      const mockDetector = {
        isSilentLogin: jest.fn().mockReturnValue(false)
      };
      const mockRequest = {
        headers: {
          set: jest.fn()
        }
      };
      const result = new Oauth2Interceptor(mockConnection, mockDetector);
      await result.request(mockRequest);
      expect(mockConnection.trySilentLogin).toHaveBeenCalled();
      expect(mockRequest.headers.set).toBeCalledWith(expectedHeaderName, expectedHeaderValue);
    });
  });

  test('does not trigger trySilentLogin if token is valid and sets bearer token', async () => {
    const mockConnection = {
      accessToken: expectedAccessToken,
      hasValidAccessToken: true,
      trySilentLogin: jest.fn()
    };
    const mockDetector = {
      isSilentLogin: jest.fn().mockReturnValue(false)
    };
    const mockRequest = {
      headers: {
        set: jest.fn()
      }
    };
    const result = new Oauth2Interceptor(mockConnection, mockDetector);
    await result.request(mockRequest);
    expect(mockConnection.trySilentLogin).not.toHaveBeenCalled();
    expect(mockRequest.headers.set).toBeCalledWith(expectedHeaderName, expectedHeaderValue);
  });

  test('does not trigger trySilentLogin if previous trySilentLogin running and sets bearer token', async () => {
    const mockConnection = {
      accessToken: expectedAccessToken,
      hasValidAccessToken: false,
      trySilentLogin: jest.fn()
    };
    const mockDetector = {
      isSilentLogin: jest.fn().mockReturnValue(true)
    };
    const mockRequest = {
      headers: {
        set: jest.fn()
      }
    };
    const result = new Oauth2Interceptor(mockConnection, mockDetector);
    await result.request(mockRequest);
    expect(mockConnection.trySilentLogin).not.toHaveBeenCalled();
    expect(mockRequest.headers.set).toBeCalledWith(expectedHeaderName, expectedHeaderValue);
  });

  test('logs error if any', async () => {
    const mockConnection = {
      hasValidAccessToken: false
    };
    const mockDetector = {
      isSilentLogin: () => {
        throw new Error('');
      }
    };
    const mockRequest = {
      headers: {
        set: jest.fn()
      }
    };
    const result = new Oauth2Interceptor(mockConnection, mockDetector);
    try {
      await result.request(mockRequest);
    } catch {}
    expect(mockRequest.headers.set).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalled();
  });
});
