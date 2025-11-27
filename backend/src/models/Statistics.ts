import {pool} from '../config/database'
import {MainStatisticsBackendResponse, NutritionStatisticsBackendResponse} from "../types";

export class StatisticsModel {

    static async getMainInformation(userId: number): Promise<MainStatisticsBackendResponse> {
        const query = `
            SELECT
                (
                    SELECT COUNT(DISTINCT day_date)
                    FROM nutrition
                    WHERE user_id = $1
                ) AS "totalDays",
                (
                    SELECT COUNT(*)
                    FROM training
                    WHERE user_id = $1
                ) AS "totalTraining",
                (
                    SELECT COUNT(*)
                    FROM goal
                    WHERE user_id = $1
                      AND status = 1
                ) AS "totalGoalComplete",
                (
                    SELECT COUNT(*)
                    FROM activity
                    WHERE user_id = $1
                ) AS "totalActivity"
        `;

        const {rows} = await pool.query(query, [userId]);

        return rows[0] as MainStatisticsBackendResponse;
    }

    static async getNutritionInformation(userId: number): Promise<NutritionStatisticsBackendResponse> {

        const query = `
            SELECT
                COALESCE(AVG(calories), 0)::float8 AS "averageCalories",
                COALESCE(AVG(protein), 0)::float8  AS "averageProtein",
                COALESCE(AVG(fat), 0)::float8      AS "averageFat",
                COALESCE(AVG(carb), 0)::float8     AS "averageCarb"
            FROM nutrition
            WHERE user_id = $1
        `;

        const {rows} = await pool.query(query, [userId]);
        const row = rows[0] ?? {};

        return {
            averageCalories: Number(row.averageCalories) || 0,
            averageProtein: Number(row.averageProtein) || 0,
            averageFat: Number(row.averageFat) || 0,
            averageCarb: Number(row.averageCarb) || 0,
        };
    }


}
