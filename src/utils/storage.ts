import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

const storage = new MMKVLoader()
  .withInstanceID('main')
  .initialize();

export function useStorage<T>(key: string, defaultValue?: T) {
  return useMMKVStorage<T>(key, storage, defaultValue);
}

export default storage;
