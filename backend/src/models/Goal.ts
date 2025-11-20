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


}
