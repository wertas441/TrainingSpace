import { pool } from '../config/database';
import {
    CompleteGoalListFrontendResponse,
    CreateGoalFrontendStructure,
    GoalListFrontendResponse, GoalShortyFrontendResponse, GoalUpdateFrontendResponse,
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
            SELECT id,
                   public_id AS "publicId",
                   name,
                   description,
                   priority
            FROM goal
            WHERE user_id = $1 AND status IS NULL
            ORDER BY created_at DESC, id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as GoalListFrontendResponse[];
    }

    static async getShortyList(userId: number): Promise<GoalShortyFrontendResponse[]> {
        const query = `
            SELECT id,
                   public_id AS "publicId",
                   name
            FROM goal
            WHERE user_id = $1 AND status IS NULL
            ORDER BY created_at DESC, id DESC
            LIMIT 10
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as GoalShortyFrontendResponse[];
    }

    // Информация по конкретной цели пользователя
    static async information(userId: number, goalPublicId: string): Promise<GoalListFrontendResponse | null> {
        const query = `
            SELECT id,
                   public_id AS "publicId",
                   name,
                   description,
                   priority
            FROM goal
            WHERE public_id = $1 AND user_id = $2
        `;

        const { rows } = await pool.query(query, [goalPublicId, userId]);

        return rows[0] ?? null;
    }

    // Обновление существующей цели пользователя
    static async update(updateData: GoalUpdateFrontendResponse): Promise<void> {
        const query = `
            UPDATE goal
            SET name = $1, 
                description = $2,
                priority = $3
            WHERE public_id = $4 AND user_id = $5
        `;

        const values = [
            updateData.name,
            updateData.description,
            updateData.priority,
            updateData.goalId,
            updateData.userId,
        ];

        const { rowCount } = await pool.query(query, values);

        if (!rowCount) {
            throw new Error('Goal not found or access denied');
        }
    }

    // Удаление цели пользователя
    static async delete(userId: number, goalPublicId: string): Promise<boolean> {
        const query = `
            DELETE FROM goal
            WHERE public_id = $1 AND user_id = $2
            RETURNING id
        `;

        const { rowCount } = await pool.query(query, [goalPublicId, userId]);

        return !!rowCount;
    }

    static async complete(userId: number, goalPublicId: string): Promise<boolean> {
        const query = `
            UPDATE goal
            SET status = 1,
                achieve_at = NOW()
            WHERE public_id = $1 AND user_id = $2
            RETURNING id
        `;

        const { rowCount } = await pool.query(query, [goalPublicId, userId]);

        return !!rowCount;
    }

    static async getCompleteList(userId: number): Promise<CompleteGoalListFrontendResponse[]> {
        const query = `
            SELECT id,
                   public_id AS "publicId",
                   name,
                   description,
                   achieve_at
            FROM goal
            WHERE user_id = $1 AND status IS NOT NULL
            ORDER BY achieve_at DESC, id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as CompleteGoalListFrontendResponse[];
    }
}
