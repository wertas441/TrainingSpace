
export interface ChangePasswordFrontendStructure {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordBackendRequest extends ChangePasswordFrontendStructure {
    userId: number;
}

export interface ChangeEmailFrontendStructure {
    newEmail: string;
    currentPassword: string;
}

export interface ChangeEmailBackendRequest extends ChangeEmailFrontendStructure {
    userId: number;
}

