export type TApiResponse<T> = {
    readonly success: boolean;
    readonly status: number;
    readonly data: T;
    readonly info?: string;
};
export type TApiPaginateResponse<T> = {
    readonly success: boolean;
    readonly status: number;
    readonly meta_data: TMetaData<T>;
    readonly info?: string;
    readonly total?: number;
};
export type TMetaData<T> = {
    readonly data: T[];
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
}

export type TLoginResponse = {
    user: TUser,
    token: string;
}

export type TUser = {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at: Date | null;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export type TMenus = {
    id: bigint;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    created_at: Date;
    updated_at: Date;
}

export type TTables = {
    id: number,
    table_number: number,
    capacity: number,
}

export type TReservation = {
    id: number,
    reserved_at: string,
    status: string,
    note: string,
    user: TUser,
    tables: TTables[],
    action: () => void;
    customer_name: string;
    remark: string
}


export type Void = {
    (): void;
}
