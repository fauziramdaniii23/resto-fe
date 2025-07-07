import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createEncryptedStorage} from "../pages/util/encryptor.ts";

type User = {
    id: number | null;
    name: string | null;
    username: string | null;
    email: string | null;
    role: string | null;
};

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (data: {
        token: string;
        id: number;
        name: string;
        username: string;
        email: string;
        role: string;
    }) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            login: ({token, id, name, username, email, role}) =>
                set({
                    isAuthenticated: true,
                    token: token,
                    user: {
                        id,
                        name,
                        username,
                        email,
                        role,
                    },
                }),
            logout: () =>
                set({
                    isAuthenticated: false,
                    token: null,
                    user: null,
                }),
        }),
        {
            name: 'auth',
            storage: createEncryptedStorage(),
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                token: state.token,
                user: state.user,
            }) as AuthState,
        }
    )
);

export interface SignInData {
    email: string | null;
    password: string | null;
}

interface SignInStore extends SignInData {
    save: (data: SignInData) => void;
    delete: () => void;
}

export const useRememberSignIn = create<SignInStore>()(
    persist(
        (set) => ({
            email: null,
            password: null,
            save: ({email, password}) =>
                set({
                    email,
                    password,
                }),
            delete: () =>
                set({
                    email: null,
                    password: null,
                }),
        }),
        {
            name: 'rememberSignIn',
            storage: createEncryptedStorage(),
            partialize: (state) => ({
                email: state.email,
                password: state.password,
            }) as SignInStore,
        }
    )
);

// export const useRememberSignIn = create<SignInStore>((set) => ({
//     email: null,
//     password: null,
//     save: ({ email, password }) =>
//         set({
//             email,
//             password,
//         }),
//     delete: () =>
//         set({
//             email: null,
//             password: null,
//         }),
// }));


