export interface User {
    id: string;
    email: string;
    userName: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Типы для запросов
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
