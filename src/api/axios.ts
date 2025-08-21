import axios from 'axios';
import {useAuthStore} from "../store/useAuthStore.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60 * 1000,
    withCredentials: true,
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    // },
});

api.interceptors.request.use((config) => {
    const { token, isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated && token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
});

export default api;

