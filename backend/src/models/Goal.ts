import { pool } from '../config/database';
import {GoalPriority} from "../types/goalBackendTypes";

export class GoalModel {

    // Создание новой цели
    static async create(goalData: {
        user_id: number;
        name: string;
        description: string;
        priority: GoalPriority;
    }) {
        const query = `
            INSERT INTO goal (user_id, name, description, priority)
            VALUES ($1, $2, $3, $4)
        `;

        const values = [
            goalData.user_id,
            goalData.name,
            goalData.description,
            goalData.priority,
        ];

        await pool.query(query, values);
    }

    // Список целей пользователя
    static async getList(userId: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        priority: GoalPriority;
    }[]> {
        const query = `
            SELECT id, name, description, priority
            FROM goal
            WHERE user_id = $1
            ORDER BY created_at DESC, id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as {
            id: number;
            name: string;
            description: string | null;
            priority: GoalPriority;
        }[];
    }
}
