export interface UserProfileRequest {
    id: string;
    email: string;
    userName: string;
    /**
     * Дата создания аккаунта.
     * На бэке может быть Date, но на фронт чаще всего прилетает строка,
     * поэтому поддерживаем оба варианта.
     */
    createdAt: string | Date;
}