import { pool } from '../config/database';
import {User, UserProfileResponse} from "../types/authBackendTypes";

export class UserModel {

    // Создание нового пользователя
    static async create(userData: {
        email: string;
        userName: string;
        password: string;
    }): Promise<User> {
        const query = `
      INSERT INTO users (email, username, password_hash, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, email, username, created_at, updated_at
    `;

        const values = [userData.email, userData.userName, userData.password];
        const result = await pool.query(query, values);
        const row = result.rows[0];
        return {
            id: row.id,
            email: row.email,
            userName: row.username,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        } as unknown as User;
    }

    // Поиск пользователя по email
    static async findByEmail(email: string): Promise<User | null> {
        // Храним хеш в колонке password_hash, но в объекте пользователя
        // возвращаем его в свойстве password (для последующей проверки при логине)
        const query = 'SELECT id, email, username, password_hash AS password, created_at, updated_at FROM users WHERE email = $1';
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
        } as unknown as User;
    }

    // Поиск пользователя по ID
    static async findById(id: number): Promise<UserProfileResponse | null> {
        const query = 'SELECT public_id, email, username, created_at FROM users WHERE id = $1';

        const result = await pool.query(query, [id]);

        const row = result.rows[0];

        if (!row) return null;

        return {
            publicId: row.public_id,
            email: row.email,
            userName: row.username,
            createdAt: row.created_at,
        } as unknown as UserProfileResponse;
    }

    // Поиск пользователя по userName
    static async findByuserName(userName: string): Promise<User | null> {
        const query = 'SELECT id, email, username, created_at, updated_at FROM users WHERE username = $1';
        const result = await pool.query(query, [userName]);
        const row = result.rows[0];
        if (!row) return null;
        return {
            id: row.id,
            email: row.email,
            userName: row.username,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        } as unknown as User;
    }

    // Обновление пользователя
    static async update(id: string, updateData: Partial<User>): Promise<User | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (updateData.email) {
            fields.push(`email = $${paramCount++}`);
            values.push(updateData.email);
        }
        if (updateData.userName) {
            fields.push(`username = $${paramCount++}`);
            values.push(updateData.userName);
        }
        if (updateData.password) {
            // сюда должен приходить УЖЕ захешированный пароль
            fields.push(`password_hash = $${paramCount++}`);
            values.push(updateData.password);
        }

        if (fields.length === 0) {
            return null;
        }

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, username, created_at, updated_at
    `;

        const result = await pool.query(query, values);
        const row = result.rows[0];
        if (!row) return null;
        return {
            id: row.id,
            email: row.email,
            userName: row.username,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        } as unknown as User;
    }

    // Удаление пользователя
    static async delete(id: string): Promise<boolean> {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    // Получение всех пользователей (для админки)
    static async findAll(limit = 50, offset = 0): Promise<User[]> {
        const query = `
      SELECT id, email, username, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
        const result = await pool.query(query, [limit, offset]);
        return result.rows.map((row: any) => ({
            id: row.id,
            email: row.email,
            userName: row.username,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        })) as unknown as User[];
    }
}
