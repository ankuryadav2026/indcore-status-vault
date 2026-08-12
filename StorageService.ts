import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  saveData: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error("Storage Error:", error);
      return false;
    }
  },
  getData: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Retrieval Error:", error);
      return null;
    }
  }
};
