export type TPaginationResponse<T> = {
    readonly data: Array<T>;
    readonly total?: number | string;
};
export type TApiResponse<T> = {
    readonly success: boolean;
    readonly status: number;
    readonly data: T;
    readonly info?: string;
};

export type TLoginResponse = {
    user: TUser,
    token: string;
}

export type TUser = {
    id: bigint;
    name: string;
    username: string;
    email: string;
    email_verified_at: Date | null;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export type Menus = {
    id: bigint;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    created_at: Date;
    updated_at: Date;
}

export type Void = {
    (): void;
}
