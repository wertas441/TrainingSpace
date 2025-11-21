
export interface ChangePasswordFrontendStructure {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangeEmailFrontendStructure {
    currentEmail: string;
    newEmail: string;
    currentPassword: string;
}