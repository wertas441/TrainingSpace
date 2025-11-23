
export interface ChangePasswordFrontendStructure {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordBackendRequest {
    user_id: number;
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface ChangeEmailFrontendStructure {
    currentEmail: string;
    newEmail: string;
    currentPassword: string;
}


