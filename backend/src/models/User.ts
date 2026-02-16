import { pool } from '../config/database';
import {
    ChangeEmailFrontendStructure,
    ChangePasswordFrontendStructure,
    User,
    UserCreateRequest,
    UserProfileResponse
} from "../types/user";
import bcrypt from "bcryptjs";

export class UserModel {

    static async create(userData: UserCreateRequest) {
        const query = `
        INSERT INTO users (email, username, password_hash, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        `;

        const values = [userData.email, userData.userName, userData.password];
        await pool.query(query, values);
    }

    static async findByEmail(email: string): Promise<User | null> {
        const query = `
        SELECT  id, 
                email, 
                username, 
                password_hash AS password, 
                created_at, 
                updated_at 
        FROM users 
        WHERE email = $1
        `;

        const result = await pool.query(query, [email]);
        const row = result.rows[0];
        if (!row) return null;

        return {
            id: row.id,
            email: row.email,
            userName: row.username,
            password: row.password,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        } as User;
    }

    static async findById(id: number): Promise<UserProfileResponse | null> {
        const query = `
        SELECT  public_id, 
                email, 
                username, 
                created_at 
        FROM users 
        WHERE id = $1
        `;

        const result = await pool.query(query, [id]);

        const row = result.rows[0];

        if (!row) return null;

        return {
            publicId: row.public_id,
            email: row.email,
            userName: row.username,
            createdAt: row.created_at,
        } as UserProfileResponse;
    }

    static async findByUserName(userName: string): Promise<User | null> {
        const query = `
        SELECT  id, 
                email, 
                username, 
                password_hash AS password, 
                created_at, 
                updated_at 
        FROM users 
        WHERE username = $1`
        ;

        const result = await pool.query(query, [userName]);
        const row = result.rows[0];
        if (!row) return null;

        return {
            id: row.id,
            email: row.email,
            userName: row.username,
            password: row.password,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        } as User;
    }

    private static async verifyUserAndGetInfo(userId: number, currentPassword: string) {
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

        return userRow;
    }

    static async changePassword(userId: number, data: ChangePasswordFrontendStructure)  {

        await this.verifyUserAndGetInfo(userId, data.currentPassword);

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

        const normalizedNewEmail = data.newEmail.trim().toLowerCase();

        const userRow = await this.verifyUserAndGetInfo(userId, data.currentPassword);

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

    static async logout(userId: number) {
        const query = `UPDATE users SET last_seen_at = NOW() WHERE id = $1`;

        await pool.query(query, [userId]);
    }

}
