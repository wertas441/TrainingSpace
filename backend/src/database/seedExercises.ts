import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

interface ExercisesStructure {
    id: number;
    name: string;
    difficulty: 'Лёгкий' | 'Средний' | 'Сложный';
    description: string;
    partOfTheBody: number[];
}

interface PartOfBodyStructure {
    id: number;
    partName: string;
}

const seedDataDir = path.join(__dirname, 'seedData');

const loadSeedData = <T>(fileName: string): T => {
    const filePath = path.join(seedDataDir, fileName);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
};

const partOfBodySeed = loadSeedData<PartOfBodyStructure[]>('partOfBodySeed.json');
const exercisesSeed = loadSeedData<ExercisesStructure[]>('exercisesSeed.json');

export async function seedExercises(): Promise<void> {
    console.log('Seeding body_parts, exercises and exercise_body_parts...');

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const part of partOfBodySeed) {
            await client.query(
                `
                    INSERT INTO body_parts (id, part_name)
                    VALUES ($1, $2)
                    ON CONFLICT (id) DO UPDATE
                        SET part_name = EXCLUDED.part_name
                `,
                [part.id, part.partName]
            );
        }

        await client.query(`
            SELECT setval(
                pg_get_serial_sequence('body_parts', 'id'),
                (SELECT COALESCE(MAX(id), 0) FROM body_parts)
            )
        `);

        for (const ex of exercisesSeed) {
            await client.query(
                `
                    INSERT INTO exercises (id, exercise_name, description, difficulty)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (id) DO UPDATE
                        SET exercise_name = EXCLUDED.exercise_name,
                            description   = EXCLUDED.description,
                            difficulty    = EXCLUDED.difficulty
                `,
                [ex.id, ex.name, ex.description, ex.difficulty]
            );
        }

        await client.query(`
            SELECT setval(
                pg_get_serial_sequence('exercises', 'id'),
                (SELECT COALESCE(MAX(id), 0) FROM exercises)
            )
        `);

        for (const ex of exercisesSeed) {
            const exerciseId = ex.id;

            // Очищаем старые связи, чтобы сид приводил к актуальному состоянию
            await client.query(
                'DELETE FROM exercise_body_parts WHERE exercise_id = $1',
                [exerciseId]
            );

            for (const bodyPartId of ex.partOfTheBody) {
                await client.query(
                    `
                        INSERT INTO exercise_body_parts (exercise_id, body_part_id)
                        VALUES ($1, $2)
                        ON CONFLICT (exercise_id, body_part_id) DO NOTHING
                    `,
                    [exerciseId, bodyPartId]
                );
            }
        }

        await client.query('COMMIT');

        console.log(
            `Seeding finished. body_parts: ${partOfBodySeed.length}, exercises: ${exercisesSeed.length}`
        );
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error while seeding exercises/body parts:', err);
        throw err;
    } finally {
        client.release();
    }
}

if (require.main === module) {
    seedExercises()
        .then(() => {
            console.log('Seed script completed successfully');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Error while seeding exercises:', err);
            process.exit(1);
        });
}