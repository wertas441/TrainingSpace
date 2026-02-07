import { pool } from '../config/database';
import {
    User,
    UserCreateRequest,
    UserProfileResponse
} from "../types/user";

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

    static async logout(userId: number) {
        const query = `UPDATE users SET last_seen_at = NOW() WHERE id = $1`;

        await pool.query(query, [userId]);
    }

}
