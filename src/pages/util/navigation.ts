let navigateFunction: (path: string, options?: Record<string, unknown>) => void;

export const setNavigate = (fn: typeof navigateFunction) => {
    navigateFunction = fn;
};

export const redirectTo = (path: string, options?: Record<string, unknown>) => {
    if (navigateFunction) {
        navigateFunction(path, options);
    }
};
