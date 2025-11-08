import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import authRoutes from './routes/auth';
import { config } from './config';
import { testConnection, closePool } from './config/database';
import { initDatabase, seedDatabase } from './database/init';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = config.port;
const shouldInit = process.env.DB_AUTO_INIT === 'true';
const shouldSeed = process.env.DB_AUTO_SEED === 'true' && config.nodeEnv === 'development';

// Middleware
app.use(helmet()); // Безопасность

app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // CORS для фронтенда с поддержкой credentials

app.use(morgan('combined')); // Логирование
app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded данных
app.use(cookieParser()); // Куки

// API роуты
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Обработка 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        path: req.originalUrl
    });
});

// Обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const isDev = process.env.NODE_ENV !== 'production';
    // Расширенное логирование в консоль
    console.error('Глобальная ошибка:', {
        path: req.originalUrl,
        method: req.method,
        message: err?.message,
        stack: isDev ? err?.stack : undefined
    });
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: isDev ? (err?.message || 'Неизвестная ошибка') : 'Что-то пошло не так'
    });
});

// Инициализация и запуск сервера
const startServer = async () => {
    try {
        // Тестируем подключение к базе данных
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('Не удалось подключиться к базе данных');
            process.exit(1);
        }

        // Инициализация схемы и сидирование включаются флагами окружения
        if (shouldInit) {
            await initDatabase();
        }
        if (shouldSeed) {
            await seedDatabase();
        }

        // Запускаем HTTP сервер
        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
            console.log(`API доступно по адресу: http://localhost:${PORT}`);
            console.log(`Проверка здоровья: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
        process.exit(1);
    }
};

// Обработка завершения процесса
process.on('SIGINT', async () => {
    console.log('\nПолучен сигнал SIGINT, завершаем работу...');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nПолучен сигнал SIGTERM, завершаем работу...');
    await closePool();
    process.exit(0);
});

// Запускаем сервер
startServer();

export default app;
