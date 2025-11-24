import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import {ChangePasswordBackendRequest} from "../types/settingsBackendTypes";

export class SettingModel {

    static async changePassword(userData: ChangePasswordBackendRequest)  {

        // Находим пользователя и его текущий хеш пароля
        const getUserQuery = `
            SELECT id, password_hash
            FROM users
            WHERE id = $1
        `;

        const userResult = await pool.query(getUserQuery, [userData.userId]);
        const userRow = userResult.rows[0];

        if (!userRow) {
            const error: any = new Error('User not found');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        // Проверяем, что текущий пароль введён верно
        const isPasswordValid = await bcrypt.compare(
            userData.currentPassword,
            userRow.password_hash
        );

        if (!isPasswordValid) {
            const error: any = new Error('Неверный текущий пароль');
            error.code = 'INVALID_CURRENT_PASSWORD';
            throw error;
        }

        // Хешируем новый пароль и обновляем его в таблице users
        const newHashedPassword = await bcrypt.hash(userData.newPassword, 10);

        const updateQuery = `
            UPDATE users
            SET password_hash = $1,
                updated_at = NOW()
            WHERE id = $2
        `;

        await pool.query(updateQuery, [newHashedPassword, userData.userId]);
    }

    // Список дней пользователя
    // static async changeEmail(userId: number): Promise<DayListFrontendStructure[]> {
    //
    //     const query = `
    //         SELECT
    //             id,
    //             name,
    //             description,
    //             calories,
    //             protein,
    //             fat,
    //             carb,
    //             day_date AS date
    //         FROM nutrition
    //         WHERE user_id = $1
    //         ORDER BY created_at DESC, id DESC
    //     `;
    //
    //     const { rows } = await pool.query(query, [userId]);
    //
    //     return rows as DayListFrontendStructure[];
    // }
}
