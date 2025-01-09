import { PluginConfiguration } from '../../src/plugin-configuration';

// mock oidc Logger function
jest.mock('oidc-client-ts');
import { Log, WebStorageStateStore } from 'oidc-client-ts';

describe('PluginConfiguration', () => {
  describe('ctor()', () => {
    test('defines a new PluginConstructor instance with specified options', () => {
      const expectedAuthority = 'test';
      const options = { onError: '', userManagerSettings: { authority: expectedAuthority } };
      const pluginConfiguration = new PluginConfiguration(options);
      expect(pluginConfiguration).toEqual(expect.objectContaining(options));
    });
  });

  describe('setLogger(logger)', () => {
    test('calls Log.setLogger with logger parameter and returns the current instance', () => {
      const options = {};
      const expectedLogger = { logger: '' };
      const pluginConfiguration = new PluginConfiguration(options);
      const expectedInstance = pluginConfiguration.setLogger(expectedLogger);
      expect(expectedInstance).toBe(pluginConfiguration);
      expect(Log.setLogger.mock.calls[0][0]).toBe(expectedLogger);
    });
  });

  describe('setLogLevel(level)', () => {
    test('calls Log.setLevel with level parameter and returns the current instance', () => {
      const options = {};
      const expectedLevel = 3;
      const pluginConfiguration = new PluginConfiguration(options);
      const expectedInstance = pluginConfiguration.setLogLevel(expectedLevel);
      expect(expectedInstance).toBe(pluginConfiguration);
      expect(Log.setLevel.mock.calls[0][0]).toBe(expectedLevel);
    });
  });

  describe('setStorage(store)', () => {
    test('configures stateStore and userStore settings with store parameter and returns the current instance', () => {
      const expectedAuthority = 'authority';
      const options = { userManagerSettings: { authority: expectedAuthority } };
      const expectedStore = { store: '' };
      const pluginConfiguration = new PluginConfiguration(options);
      const expectedInstance = pluginConfiguration.setStorage(expectedStore);
      expect(expectedInstance).toBe(pluginConfiguration);
      expect(WebStorageStateStore).toHaveBeenCalledTimes(2);
      expect(expectedInstance.userManagerSettings.stateStore).toBeDefined();
      expect(expectedInstance.userManagerSettings.userStore).toBeDefined();
    });
  });
});
