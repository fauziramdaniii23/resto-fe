import api from "./axios.ts";
import {showToast} from "../pages/util/toast.ts";
import {redirectTo} from "../pages/util/navigation.ts";

let logoutHandler: (() => void) | null = null;

export const injectLogoutHandler = (logout: () => void) => {
    logoutHandler = logout;
};

export const requestGet = async <T>(url: string): Promise<T> => {
    try {
        const response = await api.get<T>(url);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
        throw error;
    }
};

export const requestPost = async <T, D = undefined>(url: string, data?: D): Promise<T> => {
    try {
        const response = await api.post<T>(url, data);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
        throw error;
    }
};

export const requestPut = async <T, D = undefined>(url: string, data?: D): Promise<T> => {
    try {
        const response = await api.put<T>(url, data);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
        throw error;
    }
};
const handleError = (error: any) => {
    let message = 'Terjadi kesalahan. Silakan hubungi administrator.';

    if (error.code === 'ECONNABORTED') {
        message = 'Request Timeout. Silakan coba lagi.';
    }
    const err = error.response;

    switch (err.status) {
        case 401:
            message = 'Sesi berakhir. Silakan masuk kembali.';
            if (logoutHandler) {
                logoutHandler();
            }
            redirectTo('/SignIn', {replace: true});
            break;

        case 403:
            message = 'Anda tidak memiliki izin untuk mengakses.';
            break;

        case 404:
            message = 'Sumber daya tidak ditemukan.';
            break;

        default:
            if (err.data?.info) {
                message = err.data.info;
            }
            break;
    }

    showToast('error', message);
};


export const redirectToGoogle = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${baseUrl}/auth/google/redirect`;
};
