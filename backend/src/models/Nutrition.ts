import { pool } from '../config/database';
import {
    AddNewDayFrontendStructure,
    DayListFrontendStructure,
    DayUpdateFrontendStructure,
} from "../types/nutritionBackendTypes";

export class NutritionModel {

    static async create(userId: number, nutritionData: AddNewDayFrontendStructure) {

        // Проверяем, есть ли уже запись с такой датой для этого пользователя
        const checkQuery = `
            SELECT id
            FROM nutrition
            WHERE user_id = $1 AND day_date = $2::date
            LIMIT 1
        `;

        const { rows } = await pool.query(checkQuery, [userId, nutritionData.date,]);

        if (rows.length > 0) {
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
            userId,
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
            SELECT  id,
                    public_id AS "publicId",
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

    static async information(userId: number, dayPublicId: string): Promise<DayListFrontendStructure | null> {
        const query = `
            SELECT  id,
                    public_id AS "publicId",
                    name, 
                    description, 
                    calories, 
                    protein, 
                    fat, 
                    carb, 
                    to_char(day_date::date, 'YYYY-MM-DD') AS date
            FROM nutrition
            WHERE public_id = $1 AND user_id = $2
        `;

        const { rows } = await pool.query(query, [dayPublicId, userId]);

        return rows[0] ?? null;
    }

    static async update(userId: number, updateData: DayUpdateFrontendStructure): Promise<void> {
        const query = `
            UPDATE nutrition
            SET name = $1, 
                description = $2,
                calories = $3, 
                protein = $4, 
                fat = $5 , 
                carb = $6, 
                day_date = $7
            WHERE public_id = $8 AND user_id = $9
        `;

        const values = [
            updateData.name,
            updateData.description,
            updateData.calories,
            updateData.protein,
            updateData.fat,
            updateData.carb,
            updateData.date,
            updateData.publicId,
            userId
        ];

        const { rowCount } = await pool.query(query, values);

        if (!rowCount) {
            throw new Error('day not found or access denied');
        }
    }

    static async delete(userId: number, dayPublicId: string): Promise<boolean> {
        const query = `
            DELETE FROM nutrition
            WHERE public_id = $1 AND user_id = $2
            RETURNING id
        `;

        const { rowCount } = await pool.query(query, [dayPublicId, userId]);

        return !!rowCount;
    }
}
