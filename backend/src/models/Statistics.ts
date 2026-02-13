import {pool} from '../config/database'
import {
    MainStatisticsBackendResponse,
    NutritionGraphicBackendResponse,
    NutritionStatisticsBackendResponse
} from "../types/statistics";

export class StatisticsModel {

    static async getMainInformation(userId: number): Promise<MainStatisticsBackendResponse> {
        const query = `
            SELECT (
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
            SELECT  COALESCE(ROUND(AVG(calories)::numeric, 1), 0)::float8 AS "averageCalories",
                    COALESCE(ROUND(AVG(protein)::numeric, 1), 0)::float8  AS "averageProtein",
                    COALESCE(ROUND(AVG(fat)::numeric, 1), 0)::float8      AS "averageFat",
                    COALESCE(ROUND(AVG(carb)::numeric, 1), 0)::float8     AS "averageCarb"
            FROM    nutrition
            WHERE   user_id = $1
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

    static async getNutritionGraphicInformation(userId: number): Promise<NutritionGraphicBackendResponse[]> {
        const query = `
            SELECT  to_char(day_date::date, 'DD-MM-YYYY') AS date,
                    SUM(calories) AS calories,
                    SUM(protein)  AS protein,
                    SUM(fat)      AS fat,
                    SUM(carb)     AS carb
            FROM    nutrition
            WHERE   user_id = $1
            GROUP   BY day_date
            ORDER   BY day_date ASC
        `;

        const {rows} = await pool.query(query, [userId]);

        return rows as NutritionGraphicBackendResponse[];
    }


}
