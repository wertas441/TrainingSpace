const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '..', 'src', 'database', 'schema.sql');
const targetDir = path.resolve(__dirname, '..', 'dist', 'database');
const targetPath = path.join(targetDir, 'schema.sql');

try {
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Файл не найден: ${sourcePath}`);
    }

    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
} catch (error) {
    console.error('Не удалось скопировать schema.sql:', error.message);
    process.exit(1);
}


