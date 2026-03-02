import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Storage save error', e);
    return false;
  }
};

export const loadJSON = async (key) => {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.warn('Storage load error', e);
    return null;
  }
};

export const removeKey = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn('Storage remove error', e);
    return false;
  }
};
