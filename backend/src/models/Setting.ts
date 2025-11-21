import { pool } from '../config/database';
import {AddDayModelRequestStructure, DayListFrontendStructure} from "../types/nutritionBackendTypes";

export class SettingMode {
    static async ca(nutritionData: AddDayModelRequestStructure) {

        const query = `
            INSERT INTO nutrition 
                (
                 user_id, 
                 name, 
                 description, 
                 calories, 
                 protein, 
                 fat, 
                 carb, 
                 day_date 
                )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )
        `;

        const values = [
            nutritionData.user_id,
            nutritionData.name,
            nutritionData.description,
            nutritionData.calories,
            nutritionData.protein,
            nutritionData.fat,
            nutritionData.carb,
            nutritionData.day_date,
        ];

        await pool.query(query, values);
    }

    // Список дней пользователя
    static async getList(userId: number): Promise<DayListFrontendStructure[]> {

        const query = `
            SELECT 
                id,
                name,
                description,
                calories,
                protein,
                fat,
                carb,
                day_date AS date
            FROM nutrition
            WHERE user_id = $1
            ORDER BY created_at DESC, id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as DayListFrontendStructure[];
    }
}
