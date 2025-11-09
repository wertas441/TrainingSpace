// Базовые типы для API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

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
