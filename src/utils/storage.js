import localforage from "localforage";
import {v4 as uuid} from "uuid";

const imageStorageName = "images";

const imageStorage = localforage.createInstance({
    name: imageStorageName,
});

const urlMap = new Map();

export const get = async (key) => {
    return [await imageStorage.getItem(key), key];
};

export const getUrl = async (key) => {
    if (urlMap.has(key)) return urlMap.get(key);
    const img = await imageStorage.getItem(key);
    return urlMap.set(key, URL.createObjectURL(img)).get(key);
};

export const set = async (value) => {
    const key = uuid();
    await imageStorage.setItem(key, value);
    return key;
};

export const remove = async (key) => {
    return await imageStorage.removeItem(key);
};

export const clear = async () => {
    return await imageStorage.clear();
};

export const getAllKeys = async () => {
    return await imageStorage.keys();
};

export const getAll = async (keys) => {
    return Promise.all(keys.map((key) => get(key))).then(imgs => imgs.map(([img, key]) => {
        if (urlMap.has(key)) return urlMap.get(key);
        return urlMap.set(key, URL.createObjectURL(img)).get(key);
    }));
}