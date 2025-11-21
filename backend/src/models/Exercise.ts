import {pool} from '../config/database';
import {ExerciseListFrontendStructure} from "../types/exercisesBacknendTypes";

// Маппинг сложности упражнений по id (совпадает с фронтовым справочником)
const difficultyById: Record<number, ExerciseListFrontendStructure["difficulty"]> = {
    1: 'middle',
    2: 'middle',
    3: 'light',
    4: 'middle',
    5: 'light',
    6: 'hard',
    7: 'hard',
    8: 'middle',
    9: 'middle',
    10: 'hard',
    11: 'light',
    12: 'light',
    13: 'middle',
    14: 'light',
    15: 'light',
    16: 'middle',
    17: 'middle',
    18: 'middle',
    19: 'hard',
    20: 'middle',
    21: 'middle',
    22: 'middle',
    23: 'light',
    24: 'middle',
    25: 'light',
    26: 'hard',
    27: 'light',
    28: 'light',
    29: 'light',
    30: 'hard',
};

export class ExerciseModel {

    /**
     * Список упражнений:
     * - id
     * - name (exercise_name)
     * - description
     * - difficulty (по справочнику)
     * - partOfTheBody: string[] (названия групп мышц из body_parts)
     */
    static async getList(): Promise<ExerciseListFrontendStructure[]> {
        const query = `
            SELECT
                e.id,
                e.exercise_name AS name,
                COALESCE(e.description, '') AS description,
                COALESCE(
                    ARRAY_AGG(bp.part_name ORDER BY bp.part_name)
                    FILTER (WHERE bp.part_name IS NOT NULL),
                    '{}'::TEXT[]
                ) AS "partOfTheBody"
            FROM exercises e
                     LEFT JOIN exercise_body_parts ebp ON ebp.exercise_id = e.id
                     LEFT JOIN body_parts bp ON bp.id = ebp.body_part_id
            GROUP BY e.id, e.exercise_name, e.description
            ORDER BY e.id ASC
        `;

        const { rows } = await pool.query(query);

        return rows.map((row: any) => ({
            id: row.id as number,
            name: row.name as string,
            description: row.description as string,
            partOfTheBody: row.partOfTheBody as string[],
            difficulty: difficultyById[row.id] ?? 'light',
        }));
    }
}
