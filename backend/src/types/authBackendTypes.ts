export interface User {
    id: string;
    email: string;
    userName: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfileResponse {
    publicId: string;
    email: string;
    userName: string;
    createdAt: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
}


