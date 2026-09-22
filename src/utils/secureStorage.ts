/* eslint-disable class-methods-use-this */
import * as SecureStore from 'expo-secure-store';

const OPTIONS: SecureStore.SecureStoreOptions = {
  requireAuthentication: false,
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

class SecureStorage {
  firstRun() {
    // const alreadyStarted = storage.getString('app.alreadyStarted');
    // if (!alreadyStarted ) {
    //   this.clearStore();
    //   storage.setStringAsync('app.alreadyStarted', '1');
    // }
  }

  setString(key: string, value: string): void {
    return this.setMap<string>(key, value);
  }

  getString(key: string): string | null {
    return this.getMap<string>(key);
  }

  getStringAsync(key: string): Promise<string | null> {
    return this.getMapAsync<string>(key);
  }

  setStringAsync(key: string, value: string): Promise<void> {
    return this.setMapAsync<string>(key, value);
  }

  setInt(key: string, value: number): void {
    return this.setMap<number>(key, value);
  }

  getInt(key: string): number | null {
    return this.getMap<number>(key);
  }

  setIntAsync(key: string, value: number): Promise<void> {
    return this.setMapAsync<number>(key, value);
  }

  getIntAsync(key: string): Promise<number | null> {
    return this.getMapAsync<number>(key);
  }

  setBool(key: string, value: boolean): void {
    return this.setMap<boolean>(key, value);
  }

  getBool(key: string): boolean | null {
    return this.getMap<boolean>(key);
  }

  setBoolAsync(key: string, value: boolean): Promise<void> {
    return this.setMapAsync<boolean>(key, value);
  }

  getBoolAsync(key: string): Promise<boolean | null> {
    return this.getMapAsync<boolean>(key);
  }

  getArray<T = unknown>(key: string): T[] | null {
    return this.getMap<T[] & unknown[]>(key);
  }

  getArrayAsync<T = unknown>(key: string): Promise<T[] | null> {
    return this.getMapAsync<T[] & unknown[]>(key);
  }

  setArray(key: string, value: unknown[]): void {
    return this.setMap<unknown[]>(key, value);
  }

  setArrayAsync(key: string, value: unknown[]): Promise<void> {
    return this.setMapAsync<unknown[]>(key, value);
  }

  getMap<T = unknown>(key: string): T | null {
    try {
      const data = SecureStore.getItem(key, OPTIONS);
      if (data) {
        return JSON.parse(data) as T | null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  setMap<T = unknown>(key: string, value: T): void {
    return SecureStore.setItem(key, JSON.stringify(value), OPTIONS);
  }

  async getMapAsync<T = unknown>(key: string): Promise<T | null> {
    try {
      const data = await SecureStore.getItemAsync(key, OPTIONS);
      if (data) {
        return JSON.parse(data) as T | null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async setMapAsync<T = unknown>(key: string, value: T): Promise<void> {
    return SecureStore.setItemAsync(key, JSON.stringify(value), OPTIONS);
  }

  removeItems(items: string[]): void {
    items.forEach(this.removeItem);
  }

  removeItem(key: string): void {
    SecureStore.deleteItemAsync(key).catch(console.error);
  }

  clearStore(): void {
    return this.removeItems([
      'customers.token',
      'customers.profile',
    ]);
  }
}

const secureStorage = new SecureStorage();

export default secureStorage;
