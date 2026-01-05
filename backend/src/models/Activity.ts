import {pool} from '../config/database';
import {
    ActivityListFrontendStructure,
    ActivityExerciseFrontend,
    AddActivityFrontendRequest,
} from "../types/activityBackendTypes";

export class ActivityModel {

    /**
     * Создание новой активности:
     * 1) создаём запись в activity
     * 2) создаём записи в activity_exercises
     * 3) создаём подходы в activity_sets
     */
    static async create(userId: number, data: AddActivityFrontendRequest): Promise<void> {
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
                userId,
                data.trainingId,
                data.activityName,
                data.description,
                data.activityType,
                data.activityDifficult,
                data.performedAt,
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
                a.public_id AS "publicId",
                a.activity_name AS name,
                COALESCE(a.description, '') AS description,
                to_char(a.performed_at::date, 'DD-MM-YYYY') AS "activityDate",
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
            publicId: row.publicId as string,
            name: row.name as string,
            description: row.description as string,
            activityDate: row.activityDate as string,
            type: row.type as ActivityListFrontendStructure["type"],
            difficulty: row.difficulty as ActivityListFrontendStructure["difficulty"],
            trainingId: row.trainingId as number,
            exercises: row.exercises as ActivityExerciseFrontend[],
        }));
    }

    /**
     * Информация по одной активности пользователя
     */
    static async information(userId: number, activityPublicId: string): Promise<ActivityListFrontendStructure | null> {
        const query = `
            SELECT
                a.id,
                a.public_id AS "publicId",
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
            WHERE a.user_id = $1 AND a.public_id = $2
            GROUP BY a.id, a.activity_name, a.description, a.performed_at, a.activity_type, a.activity_difficult, a.training_id
            LIMIT 1
        `;

        const { rows } = await pool.query(query, [userId, activityPublicId]);

        if (rows.length === 0) {
            return null;
        }

        const row: any = rows[0];

        return {
            id: row.id as number,
            publicId: row.publicId as string,
            name: row.name as string,
            description: row.description as string,
            activityDate: row.activityDate as string,
            type: row.type as ActivityListFrontendStructure["type"],
            difficulty: row.difficulty as ActivityListFrontendStructure["difficulty"],
            trainingId: row.trainingId as number,
            exercises: row.exercises as ActivityExerciseFrontend[],
        };
    }

    /**
     * Удаление активности пользователя
     */
    static async delete(userId: number, activityPublicId: string): Promise<boolean> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Получаем внутренний id по public_id и user_id
            const { rows: checkRows } = await client.query(
                'SELECT id FROM activity WHERE public_id = $1 AND user_id = $2',
                [activityPublicId, userId]
            );

            if (checkRows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }

            const activityId: number = checkRows[0].id;

            // Удаляем подходы
            await client.query(
                `
                    DELETE FROM activity_sets
                    WHERE activity_exercise_id IN (
                        SELECT id FROM activity_exercises WHERE activity_id = $1
                    )
                `,
                [activityId]
            );

            // Удаляем упражнения активности
            await client.query(
                'DELETE FROM activity_exercises WHERE activity_id = $1',
                [activityId]
            );

            // Удаляем саму активность
            const { rowCount } = await client.query(
                'DELETE FROM activity WHERE id = $1 AND user_id = $2',
                [activityId, userId]
            );

            await client.query('COMMIT');

            return !!rowCount && rowCount > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }


    static async update(userId: number, data: ActivityListFrontendStructure): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { rows: checkRows } = await client.query(
                'SELECT id FROM activity WHERE public_id = $1 AND user_id = $2',
                [data.publicId, userId]
            );

            if (checkRows.length === 0) {
                throw new Error('Activity not found or access denied');
            }

            const activityId: number = checkRows[0].id;

            // Обновляем основную запись активности
            await client.query(
                `
                    UPDATE activity
                    SET training_id = $1,
                        activity_name = $2,
                        description = $3,
                        activity_type = $4,
                        activity_difficult = $5,
                        performed_at = $6::date
                    WHERE id = $7 AND user_id = $8
                `,
                [
                    data.trainingId,
                    data.name,
                    data.description,
                    data.type,
                    data.difficulty,
                    data.activityDate,
                    activityId,
                    userId,
                ]
            );

            // Очищаем старые упражнения и подходы
            await client.query(
                `
                    DELETE FROM activity_sets
                    WHERE activity_exercise_id IN (
                        SELECT id FROM activity_exercises WHERE activity_id = $1
                    )
                `,
                [activityId]
            );

            await client.query(
                'DELETE FROM activity_exercises WHERE activity_id = $1',
                [activityId]
            );

            // Добавляем новые упражнения и подходы
            for (let i = 0; i < data.exercises.length; i++) {
                const ex: ActivityExerciseFrontend = data.exercises[i];

                const { rows: aeRows } = await client.query(
                    `
                        INSERT INTO activity_exercises (activity_id, exercise_id, order_index)
                        VALUES ($1, $2, $3)
                        RETURNING id
                    `,
                    [activityId, ex.exercisesId, i + 1]
                );

                const activityExerciseId: number = aeRows[0]?.id;

                for (const s of ex.try) {
                    await client.query(
                        `
                            INSERT INTO activity_sets (activity_exercise_id, set_number, reps, weight)
                            VALUES ($1, $2, $3, $4)
                        `,
                        [
                            activityExerciseId,
                            s.id,        // set_number
                            s.quantity,  // reps
                            s.weight,    // weight
                        ]
                    );
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
}
