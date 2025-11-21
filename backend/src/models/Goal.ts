import { pool } from '../config/database';
import {
    CreateGoalFrontendStructure,
    GoalListFrontendResponse,
} from "../types/goalBackendTypes";

export class GoalModel {

    // Создание новой цели
    static async create(goalData: CreateGoalFrontendStructure) {
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
    static async getList(userId: number): Promise<GoalListFrontendResponse[]> {
        const query = `
            SELECT id, name, description, priority
            FROM goal
            WHERE user_id = $1
            ORDER BY created_at DESC, id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as GoalListFrontendResponse[];
    }
}
