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

// Функция для создания тестовых данных
export const seedDatabase = async (): Promise<void> => {
    try {
        console.log('Заполнение базы данных тестовыми данными...');

        // Проверяем, есть ли уже пользователи
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(userCount.rows[0].count) > 0) {
            console.log('База данных уже содержит данные, пропускаем заполнение');
            return;
        }

        // Создаем тестовых пользователей
        const testUsers = [
            {
                email: 'test1@example.com',
                username: 'testuser1',
                password: 'password123' // В реальном проекте пароль должен быть захеширован
            },
            {
                email: 'test2@example.com',
                username: 'testuser2',
                password: 'password123'
            }
        ];

        for (const user of testUsers) {
            await pool.query(
                'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
                [user.email, user.username, user.password]
            );
        }

        console.log('Тестовые данные успешно добавлены');
    } catch (error) {
        console.error('Ошибка при заполнении базы данных:', error);
        throw error;
    }
};

