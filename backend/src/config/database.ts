import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;

if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASSWORD) {
    throw new Error(
        'Отсутствуют обязательные переменные окружения для БД (DB_USER, DB_HOST, DB_NAME, DB_PASSWORD)',
    );
}

export const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT || '5433'),
    max: 20, // максимальное количество соединений в пуле
    idleTimeoutMillis: 30000, // время ожидания перед закрытием неактивного соединения
    connectionTimeoutMillis: 2000, // время ожидания подключения
});

// Функция для тестирования подключения
export const testConnection = async (): Promise<boolean> => {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('Подключение к PostgreSQL успешно');
        return true;
    } catch (error) {
        console.error('Ошибка подключения к PostgreSQL:', error);
        return false;
    }
};

// Функция для закрытия пула соединений
export const closePool = async (): Promise<void> => {
    await pool.end();
    console.log('Пул соединений PostgreSQL закрыт');
};

export default pool;

