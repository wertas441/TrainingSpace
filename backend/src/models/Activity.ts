import {pool} from '../config/database';
import {
    AddActivityModelRequest,
    ActivityListFrontendStructure,
    ActivityExerciseFrontend,
} from "../types/activityBackendTypes";

export class ActivityModel {

    /**
     * Создание новой активности:
     * 1) создаём запись в activity
     * 2) создаём записи в activity_exercises
     * 3) создаём подходы в activity_sets
     */
    static async create(data: AddActivityModelRequest): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertActivityQuery = `
                INSERT INTO activity (
                    user_id,
                    training_id,
                    activity_name,
                    description,
                    activity_type,
                    activity_difficult,
                    performed_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7::date)
                RETURNING id
            `;

            const { rows } = await client.query(insertActivityQuery, [
                data.user_id,
                data.training_id,
                data.activity_name,
                data.description,
                data.activity_type,
                data.activity_difficult,
                data.performed_at,
            ]);

            const activityId: number = rows[0]?.id;

            // Упражнения и подходы
            for (let i = 0; i < data.exercises.length; i++) {
                const ex = data.exercises[i];

                const insertActivityExerciseQuery = `
                    INSERT INTO activity_exercises (activity_id, exercise_id, order_index)
                    VALUES ($1, $2, $3)
                    RETURNING id
                `;

                const { rows: aeRows } = await client.query(insertActivityExerciseQuery, [
                    activityId,
                    ex.id,
                    i + 1,
                ]);

                const activityExerciseId: number = aeRows[0]?.id;

                // подходы по упражнению
                for (const s of ex.try) {
                    const insertSetQuery = `
                        INSERT INTO activity_sets (activity_exercise_id, set_number, reps, weight)
                        VALUES ($1, $2, $3, $4)
                    `;

                    await client.query(insertSetQuery, [
                        activityExerciseId,
                        s.id,          // set_number
                        s.quantity,    // reps
                        s.weight,      // weight
                    ]);
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Список активностей пользователя
     */
    static async getList(userId: number): Promise<ActivityListFrontendStructure[]> {
        const query = `
            SELECT
                a.id,
                a.activity_name AS name,
                COALESCE(a.description, '') AS description,
                to_char(a.performed_at::date, 'YYYY-MM-DD') AS "activityDate",
                a.activity_type AS type,
                a.activity_difficult AS difficulty,
                a.training_id AS "trainingId",
                COALESCE(
                    json_agg(
                            json_build_object(
                                    'exercisesId', ae.exercise_id,
                                    'try', COALESCE(
                                            (
                                                SELECT json_agg(
                                                               json_build_object(
                                                                       'id', s.set_number,
                                                                       'weight', s.weight,
                                                                       'quantity', s.reps
                                                                   )
                                                           ORDER BY s.set_number
                                                           )
                                                FROM activity_sets s
                                                WHERE s.activity_exercise_id = ae.id
                                            ),
                                            '[]'::json
                                        )
                                )
                        ORDER BY ae.order_index
                        ) FILTER (WHERE ae.id IS NOT NULL),
                    '[]'::json
                    ) AS exercises
            FROM activity a
                     LEFT JOIN activity_exercises ae ON ae.activity_id = a.id
            WHERE a.user_id = $1
            GROUP BY a.id, a.activity_name, a.description, a.performed_at, a.activity_type, a.activity_difficult, a.training_id
            ORDER BY a.performed_at DESC, a.id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows.map((row: any) => ({
            id: row.id as number,
            name: row.name as string,
            description: row.description as string,
            activityDate: row.activityDate as string,
            type: row.type as ActivityListFrontendStructure["type"],
            difficulty: row.difficulty as ActivityListFrontendStructure["difficulty"],
            trainingId: row.trainingId as number,
            exercises: row.exercises as ActivityExerciseFrontend[],
        }));
    }
}
