import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createEncryptedStorage} from "../pages/util/encryptor.ts";
import type {TUser} from "@/type/type.ts";

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    user: TUser | null;
    login: (data: {
        token: string;
        user : TUser;
    }) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            login: ({token, user}) =>
                set({
                    isAuthenticated: true,
                    token: token,
                    user : user
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


