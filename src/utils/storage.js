import localforage from "localforage";

const imageStorageName = "images";

const imageStorage = localforage.createInstance({
    name: imageStorageName,
});

export const get = async (key) => {
    return await imageStorage.getItem(key);
};

export const set = async (key, value) => {
    return await imageStorage.setItem(key, value);
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
    return Promise.all(keys.map((key) => imageStorage.getItem(key))).then(imgs => imgs.map(img => URL.createObjectURL(img)));
}