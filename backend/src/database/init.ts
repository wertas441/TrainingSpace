import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';
import { seedExercises } from './seedExercises';

export const initDatabase = async (): Promise<void> => {
    try {
        console.log('Инициализация базы данных...');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Выполняем SQL скрипт
        await pool.query(schema);

        await seedExercises();

        console.log('База данных успешно инициализирована и заполнена упражнениями');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        throw error;
    }
};
