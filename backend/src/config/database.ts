import { Pool } from 'pg';

// Создаем пул соединений с PostgreSQL
export const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'training_space',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5436'),
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

