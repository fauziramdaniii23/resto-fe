import { toast, Bounce } from 'react-toastify';
import type {ToastOptions, ToastPosition} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (type: string = 'default', message: string, options?: ToastOptions): void => {
    const toastTypes = {
        info: toast.info,
        success: toast.success,
        error: toast.error,
        warning: toast.warning,
        default: toast,
    };

    const toastFn = toastTypes[type as keyof typeof toastTypes] || toast;

    toastFn(message, {
        position: "top-right" as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        ...options,
    });
};
