import {pool} from '../config/database';
import {ExerciseListFrontendStructure} from "../types";

export class ExerciseModel {

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
}
