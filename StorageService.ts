import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  saveData: async (key: string, value: string) => {
    try { await AsyncStorage.setItem(key, value); return true; } 
    catch (e) { console.log(e); return false; }
  },
  getData: async (key: string) => {
    try { return await AsyncStorage.getItem(key); } 
    catch (e) { console.log(e); return null; }
  }
};
