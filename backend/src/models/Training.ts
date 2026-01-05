import { pool } from '../config/database';
import {
    AddTrainingFrontendStructure,
    AddTrainingModelRequestStructure,
    TrainingListFrontendStructure
} from "../types/trainingBackendTypes";

export class TrainingModel {

    /**
     * Создание новой шаблонной тренировки:
     * 1) вставляем запись в таблицу training
     * 2) сохраняем связанные упражнения в training_exercises
     */
    static async create(trainingData: AddTrainingModelRequestStructure): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            // Сохраняем саму тренировку
            const insertTrainingQuery = `
                INSERT INTO training (training_name, description, user_id)
                VALUES ($1, $2, $3)
                RETURNING id
            `;

            const insertTrainingValues = [
                trainingData.name,
                trainingData.description,
                trainingData.user_id,
            ];

            const { rows } = await client.query(insertTrainingQuery, insertTrainingValues);
            const trainingId: number = rows[0]?.id;

            // Если упражнений нет (что валидация не должна допустить) — просто создаём тренировку без связей
            if (trainingData.exercises.length > 0) {
                const insertExerciseQuery = `
                    INSERT INTO training_exercises (training_id, exercise_id, order_index)
                    VALUES ($1, $2, $3)
                `;

                for (let i = 0; i < trainingData.exercises.length; i++) {
                    const exerciseId = trainingData.exercises[i];

                    // Гарантируем существование упражнения в таблице exercises,
                    // чтобы не нарушать внешние ключи. Если упражнения с таким id нет,
                    // создаём заглушку.
                    const existing = await client.query(
                        'SELECT id FROM exercises WHERE id = $1',
                        [exerciseId]
                    );

                    if (existing.rows.length === 0) {
                        await client.query(
                            'INSERT INTO exercises (id, exercise_name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                            [exerciseId, `Exercise #${exerciseId}`, null]
                        );
                    }

                    await client.query(insertExerciseQuery, [
                        trainingId,
                        exerciseId,
                        i + 1, // порядок упражнений в тренировке
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

    static async getList(userId: number): Promise<TrainingListFrontendStructure[]> {
        const query = `
            SELECT  t.id,
                    t.public_id AS "publicId",
                    t.training_name AS name,
                    COALESCE(t.description, '') AS description,
                    COALESCE(ARRAY_AGG(te.exercise_id ORDER BY te.order_index) FILTER (WHERE te.exercise_id IS NOT NULL),
                    '{}'::INT[]) AS exercises
            FROM training t
            LEFT JOIN training_exercises te ON te.training_id = t.id
            WHERE t.user_id = $1
            GROUP BY t.id, t.training_name, t.description
            ORDER BY t.created_at DESC, t.id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as TrainingListFrontendStructure[];
    }

    static async information(userId: number, trainingPublicId: string): Promise<TrainingListFrontendStructure | null> {
        const query = `
            SELECT  t.id,
                    t.public_id AS "publicId",
                    t.training_name AS name,
                    COALESCE(t.description, '') AS description,
                    COALESCE(ARRAY_AGG(te.exercise_id ORDER BY te.order_index)FILTER (WHERE te.exercise_id IS NOT NULL),
                    '{}'::INT[]) AS exercises
            FROM training t
            LEFT JOIN training_exercises te ON te.training_id = t.id
            WHERE t.public_id = $1 AND t.user_id = $2
            GROUP BY t.id, t.training_name, t.description
        `;

        const { rows } = await pool.query(query, [trainingPublicId, userId]);

        return rows[0] ?? null;
    }

    static async update(userId: number, trainingPublicId: string, data: AddTrainingFrontendStructure): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Получаем внутренний id по public_id
            const { rows: trainingRows } = await client.query(
                'SELECT id FROM training WHERE public_id = $1 AND user_id = $2',
                [trainingPublicId, userId]
            );

            if (trainingRows.length === 0) {
                throw new Error('Training not found or access denied');
            }

            const trainingId: number = trainingRows[0].id;

            const updateTrainingQuery = `
                UPDATE training
                SET training_name = $1,
                    description   = $2
                WHERE id = $3 AND user_id = $4
            `;

            const { rowCount } = await client.query(updateTrainingQuery, [
                data.name,
                data.description,
                trainingId,
                userId,
            ]);

            if (!rowCount) {
                throw new Error('Training not found or access denied');
            }

            // Пересобираем список упражнений
            await client.query('DELETE FROM training_exercises WHERE training_id = $1', [trainingId]);

            if (data.exercises.length > 0) {
                const insertExerciseQuery = `
                    INSERT INTO training_exercises (training_id, exercise_id, order_index)
                    VALUES ($1, $2, $3)
                `;

                for (let i = 0; i < data.exercises.length; i++) {
                    const exerciseId = data.exercises[i];

                    // Гарантируем существование упражнения
                    const existing = await client.query(
                        'SELECT id FROM exercises WHERE id = $1',
                        [exerciseId]
                    );

                    if (existing.rows.length === 0) {
                        await client.query(
                            'INSERT INTO exercises (id, exercise_name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                            [exerciseId, `Exercise #${exerciseId}`, null]
                        );
                    }

                    await client.query(insertExerciseQuery, [
                        trainingId,
                        exerciseId,
                        i + 1,
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

    static async delete(userId: number, trainingPublicId: string): Promise<boolean> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Получаем внутренний id по public_id
            const { rows: trainingRows } = await client.query(
                'SELECT id FROM training WHERE public_id = $1 AND user_id = $2',
                [trainingPublicId, userId]
            );

            if (trainingRows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }

            const trainingId: number = trainingRows[0].id;

            // сначала удаляем связи упражнений
            await client.query('DELETE FROM training_exercises WHERE training_id = $1', [trainingId]);

            const deleteTrainingQuery = `
                DELETE FROM training
                WHERE id = $1 AND user_id = $2
                RETURNING id
            `;

            const { rowCount } = await client.query(deleteTrainingQuery, [trainingId, userId]);

            if (!rowCount) {
                await client.query('ROLLBACK');
                return false;
            }

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
