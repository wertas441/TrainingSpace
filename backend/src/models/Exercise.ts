import {pool} from '../config/database';
import {ExerciseListFrontendStructure} from "../types";

export class ExerciseModel {

    // Список всех упражнений
    static async getList(): Promise<ExerciseListFrontendStructure[]> {
        const query = `
            SELECT
                e.id,
                e.exercise_name AS name,
                COALESCE(e.description, '') AS description,
                e.difficulty,
                COALESCE(
                    ARRAY_AGG(bp.part_name ORDER BY bp.part_name)
                    FILTER (WHERE bp.part_name IS NOT NULL),
                    '{}'::TEXT[]
                ) AS "partOfTheBody"
            FROM exercises e
                     LEFT JOIN exercise_body_parts ebp ON ebp.exercise_id = e.id
                     LEFT JOIN body_parts bp ON bp.id = ebp.body_part_id
            GROUP BY e.id, e.exercise_name, e.description, e.difficulty
            ORDER BY e.id ASC
        `;

        const { rows } = await pool.query(query);

        return rows.map((row: any) => ({
            id: row.id as number,
            name: row.name as string,
            description: row.description as string,
            partOfTheBody: row.partOfTheBody as string[],
            difficulty: row.difficulty as ExerciseListFrontendStructure["difficulty"],
        }));
    }

    // Упражнения, привязанные к конкретной тренировке пользователя
    static async getByTrainingId(trainingId: number, userId: number): Promise<ExerciseListFrontendStructure[]> {
        const query = `
            SELECT
                e.id,
                e.exercise_name AS name,
                COALESCE(e.description, '') AS description,
                e.difficulty,
                COALESCE(
                    ARRAY_AGG(bp.part_name ORDER BY bp.part_name)
                    FILTER (WHERE bp.part_name IS NOT NULL),
                    '{}'::TEXT[]
                ) AS "partOfTheBody"
            FROM training t
                     JOIN training_exercises te ON te.training_id = t.id
                     JOIN exercises e ON e.id = te.exercise_id
                     LEFT JOIN exercise_body_parts ebp ON ebp.exercise_id = e.id
                     LEFT JOIN body_parts bp ON bp.id = ebp.body_part_id
            WHERE t.id = $1 AND t.user_id = $2
            GROUP BY e.id, e.exercise_name, e.description, e.difficulty, te.order_index
            ORDER BY te.order_index ASC, e.id ASC
        `;

        const { rows } = await pool.query(query, [trainingId, userId]);

        return rows.map((row: any) => ({
            id: row.id as number,
            name: row.name as string,
            description: row.description as string,
            partOfTheBody: row.partOfTheBody as string[],
            difficulty: row.difficulty as ExerciseListFrontendStructure["difficulty"],
        }));
    }
}
