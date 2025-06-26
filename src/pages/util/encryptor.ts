import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRIPTION_KEY;

export const encrypt = (data: unknown): string => {
    const stringified = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
};

export const decrypt = (encrypted: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (e) {
        console.error('Decrypt error:', e);
        return null;
    }
};

export const createEncryptedStorage = () => ({
    getItem: (name: string) => {
        const encrypted = localStorage.getItem(name);
        if (!encrypted) return null;
        return decrypt(encrypted);
    },
    setItem: (name: string, value: unknown) => {
        const encrypted = encrypt(value);
        localStorage.setItem(name, encrypted);
    },
    removeItem: (name: string) => localStorage.removeItem(name),
});