import { pool } from '../config/database';
import {AddDayModelRequestStructure, DayListFrontendStructure} from "../types/nutritionBackendTypes";
import {ChangePasswordBackendRequest} from "../types/settingsBackendTypes";

export class SettingModel {

    static async changePassword(userData: ChangePasswordBackendRequest)  {

        const query = `
            INSERT INTO nutrition 
                (
                 user_id, 
                 current_password,
                 new_password,
                 confirm_password,
                )
            VALUES ($1, $2, $3, $4,)
        `;

        const values = [
            userData.user_id,
            userData.current_password,
            userData.new_password,
            userData.confirm_password,
        ];

        await pool.query(query, values);
    }

    // Список дней пользователя
    // static async changeEmail(userId: number): Promise<DayListFrontendStructure[]> {
    //
    //     const query = `
    //         SELECT
    //             id,
    //             name,
    //             description,
    //             calories,
    //             protein,
    //             fat,
    //             carb,
    //             day_date AS date
    //         FROM nutrition
    //         WHERE user_id = $1
    //         ORDER BY created_at DESC, id DESC
    //     `;
    //
    //     const { rows } = await pool.query(query, [userId]);
    //
    //     return rows as DayListFrontendStructure[];
    // }
}
