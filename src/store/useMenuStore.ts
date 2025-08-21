import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createEncryptedStorage} from "../pages/util/encryptor.ts";

type MenuState = {
    id: string | null;
    name: string | null;
    data: any;
    setMenu: (id: string, name: string, data?: any) => void;
    clearMenu: () => void;
};

export const useMenuStore= create<MenuState>()(
    persist(
        (set) => ({
            id: null,
            name: null,
            data: null,
            setMenu: (id: string, name: string, data? ) =>
                set({
                    id: id,
                    name: name,
                    data: data,
                }),
            clearMenu: () =>
                set({
                    id: null,
                    name: null,
                    data: null,
                })
        }),
        {
            name: 'menu',
            storage: createEncryptedStorage(),
            partialize: (state) => ({
                id: state.id,
                name: state.name,
                data: state.data,
            }) as MenuState,
        }
    )
);

