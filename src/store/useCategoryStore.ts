import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createEncryptedStorage} from "../pages/util/encryptor.ts";
import type {TCategories} from "@/type/type.ts";

type CategoryState = {
    data: TCategories[];
    setCategory: (data: TCategories[]) => void;
    clearCategory: () => void;
};

export const useCategoryStore= create<CategoryState>()(
    persist(
        (set) => ({
            data: [],
            setCategory: (data : TCategories[] ) =>
                set({
                    data: data,
                }),
            clearCategory: () =>
                set({
                    data: [],
                })
        }),
        {
            name: 'Category',
            storage: createEncryptedStorage(),
            partialize: (state) => ({
                data: state.data,
            }) as CategoryState,
        }
    )
);

