import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import {
    ChangeEmailFrontendStructure,
    ChangePasswordFrontendStructure,
} from "../types/setting";

export class SettingModel {

    static async #verifyUserAndGetInfo(userId: number, currentPassword: string) {
        const getUserQuery = `
            SELECT  id, 
                    email, 
                    password_hash
            FROM users
            WHERE id = $1
        `;

        const userResult = await pool.query(getUserQuery, [userId]);
        const userRow = userResult.rows[0];

        if (!userRow) {
            const error: any = new Error('User not found');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            userRow.password_hash
        );

        if (!isPasswordValid) {
            const error: any = new Error('Неверный текущий пароль');
            error.code = 'INVALID_CURRENT_PASSWORD';
            throw error;
        }

        return userRow; // Возвращаем данные
    }

    static async changePassword(userId: number, data: ChangePasswordFrontendStructure)  {

        await this.#verifyUserAndGetInfo(userId, data.currentPassword);

        // Хешируем новый пароль и обновляем его в таблице users
        const newHashedPassword = await bcrypt.hash(data.newPassword, 10);

        const updateQuery = `
            UPDATE users
            SET password_hash = $1,
                updated_at = NOW()
            WHERE id = $2
        `;

        await pool.query(updateQuery, [newHashedPassword, userId]);
    }

    static async changeEmail(userId:number, data: ChangeEmailFrontendStructure) {

        // Нормализуем новый email (обрезаем пробелы, приводим к нижнему регистру)
        const normalizedNewEmail = data.newEmail.trim().toLowerCase();

        const userRow = await this.#verifyUserAndGetInfo(userId, data.currentPassword);

        const normalizedCurrentEmail =
            typeof userRow.email === 'string'
                ? userRow.email.trim().toLowerCase()
                : userRow.email;

        if (normalizedCurrentEmail === normalizedNewEmail) {
            const error: any = new Error('Новый email совпадает с текущим');
            error.code = 'EMAIL_SAME_AS_CURRENT';
            throw error;
        }

        const updateQuery = `
            UPDATE users
            SET email = $1,
                updated_at = NOW()
            WHERE id = $2
        `;

        try {
            await pool.query(updateQuery, [normalizedNewEmail, userId]);
        } catch (err: any) {
            // Обработка уникального ограничения email (PostgreSQL: 23505)
            if (err?.code === '23505') {
                const error: any = new Error('Email already in use');
                error.code = 'EMAIL_ALREADY_IN_USE';
                throw error;
            }

            throw err;
        }
    }
}
