export const validateTrainingName = (trainingName: string): string | null => {
    if (!trainingName.trim()) {
        return ('Пожалуйста, введите имя тренировки');
    }

    if (trainingName.length < 3) {
        return (`Имя тренировки должно содержать минимум 3 символа (сейчас ${trainingName.length})`);
    }

    if (trainingName.length > 40) {
        return (`Имя тренировки может содержать максимум 40 символов (сейчас ${trainingName.length})`);
    }

    // Разрешаем латиницу, цифры и базовые спецсимволы как в остальных валидаторах
    const trainingNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if (!trainingNameRegex.test(trainingName)) {
        return ('Имя тренировки может содержать буквы (лат/кир), цифры, пробелы и некоторые спец.символы')
    }

    return null;
}

export const validateTrainingDescription = (description: string): string | null => {
    // Необязательное поле
    if (!description.trim()) {
        return null;
    }
    const maxLength = 500;
    if (description.length > maxLength) {
        return (`Описание не должно превышать ${maxLength} символов (сейчас ${description.length})`);
    }
    return null;
}

export const validateTrainingExercises = (exerciseIds: number[]): string | null => {
    if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
        return ('Добавьте хотя бы одно упражнение в тренировку');
    }
    // Проверка на уникальность id
    const unique = new Set(exerciseIds);
    if (unique.size !== exerciseIds.length) {
        return ('Список упражнений содержит дубликаты');
    }

    if (exerciseIds.length > 20) {
        return ('Тренировка не может содержать больше 20 упражнений');
    }

    return null;
}
