import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

export const initDatabase = async (): Promise<void> => {
    try {
        console.log('Инициализация базы данных...');

        // Читаем SQL файл со схемой
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Выполняем SQL скрипт
        await pool.query(schema);

        console.log('База данных успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        throw error;
    }
};
