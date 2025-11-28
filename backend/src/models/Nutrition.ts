import { pool } from '../config/database';
import {
    AddDayModelRequestStructure,
    DayListFrontendStructure,
    DayUpgradeRequestStructure
} from "../types/nutritionBackendTypes";

export class NutritionModel {

    static async create(nutritionData: AddDayModelRequestStructure) {

        // Проверяем, есть ли уже запись с такой датой для этого пользователя
        const checkQuery = `
            SELECT id
            FROM nutrition
            WHERE user_id = $1
              AND day_date = $2::date
            LIMIT 1
        `;

        const { rows: existingRows } = await pool.query(checkQuery, [
            nutritionData.user_id,
            nutritionData.date,
        ]);

        if (existingRows.length > 0) {
            throw new Error('Запись с такой датой уже существует');
        }

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
            nutritionData.date,
        ];

        await pool.query(query, values);
    }

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
                to_char(day_date::date, 'DD-MM-YYYY') AS date
            FROM nutrition
            WHERE user_id = $1
            ORDER BY day_date DESC, id DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        return rows as DayListFrontendStructure[];
    }

    static async information(userId: number, dayId: number): Promise<DayListFrontendStructure | null> {
        const query = `
            SELECT 
                id, 
                name, 
                description, 
                calories, 
                protein, 
                fat, 
                carb, 
                to_char(day_date::date, 'YYYY-MM-DD') AS date
            FROM nutrition
            WHERE id = $1 AND user_id = $2
        `;

        const { rows } = await pool.query(query, [dayId, userId]);

        return rows[0] ?? null;
    }

    static async update(updateData: DayUpgradeRequestStructure): Promise<void> {
        const query = `
            UPDATE nutrition
            SET name = $1, 
                description = $2,
                calories = $3, 
                protein = $4, 
                fat = $5 , 
                carb = $6, 
                day_date = $7
            WHERE id = $8 AND user_id = $9
        `;

        const values = [
            updateData.name,
            updateData.description,
            updateData.calories,
            updateData.protein,
            updateData.fat,
            updateData.carb,
            updateData.date,
            updateData.id,
            updateData.user_id
        ];

        const { rowCount } = await pool.query(query, values);

        if (!rowCount) {
            throw new Error('day not found or access denied');
        }
    }

    static async delete(userId: number, dayId: number): Promise<boolean> {
        const query = `
            DELETE FROM nutrition
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;

        const { rowCount } = await pool.query(query, [dayId, userId]);

        return !!rowCount;
    }
}
