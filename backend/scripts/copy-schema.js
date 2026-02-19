const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '..', 'src', 'database', 'schema.sql');
const targetDir = path.resolve(__dirname, '..', 'dist', 'database');
const targetPath = path.join(targetDir, 'schema.sql');
const seedSourceDir = path.resolve(__dirname, '..', 'src', 'database', 'seedData');
const seedTargetDir = path.resolve(__dirname, '..', 'dist', 'database', 'seedData');

const copyDirSync = (fromDir, toDir) => {
    if (!fs.existsSync(fromDir)) return;
    fs.mkdirSync(toDir, { recursive: true });
    const entries = fs.readdirSync(fromDir, { withFileTypes: true });
    for (const entry of entries) {
        const fromPath = path.join(fromDir, entry.name);
        const toPath = path.join(toDir, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    }
};

try {
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Файл не найден: ${sourcePath}`);
    }

    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    copyDirSync(seedSourceDir, seedTargetDir);
} catch (error) {
    console.error('Не удалось скопировать schema.sql:', error.message);
    process.exit(1);
}


