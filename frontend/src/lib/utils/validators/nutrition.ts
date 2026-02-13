export const validateDayName = (dayName: string): string | null => {
    if(!dayName.trim()){
        return ('Пожалуйста, введите наименование для дня')
    }

    if(dayName.length < 3){
        return (`Имя дня должно содержать минимум 3 символов (сейчас ${dayName.length})`)
    }

    if(dayName.length > 40){
        return (`Имя дня может содержать максимум 40 символов (сейчас ${dayName.length})`)
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const dayNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if(!dayNameRegex.test(dayName)) {
        return ('Имя дня может содержать буквы (лат/кир), цифры, пробелы и некоторые спец.символы')
    }


    return null;
}

export const validateDayDate = (dayDate: string): string | null => {
    if (!dayDate.trim()) {
        return ('Пожалуйста, выберите дату');
    }

    // Парсим YYYY-MM-DD как локальную дату (без смещения часового пояса)
    const parts = dayDate.split('-');
    if (parts.length !== 3) {
        return ('Некорректная дата');
    }
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1; // 0-11
    const day = Number(parts[2]);

    const parsed = new Date(year, month, day);
    if (isNaN(parsed.getTime()) || parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
        return ('Некорректная дата');
    }

    const todayLocal = new Date();
    const todayStart = new Date(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate());

    if (parsed.getTime() > todayStart.getTime()) {
        return ('Дата не может быть в будущем');
    }

    return null;
}

const validateNumberInRange = (value: string, min: number, max: number, fieldLabel: string): string | null => {
    if (!value.trim()) {
        return (`Пожалуйста, введите значение для поля "${fieldLabel}"`);
    }

    if (!/^\d+$/.test(value.trim())) {
        return (`Поле "${fieldLabel}" должно быть целым числом`);
    }

    const num = parseInt(value.trim(), 10);
    if (num < min) {
        return (`${fieldLabel} не может быть меньше ${min}`);
    }
    if (num > max) {
        return (`${fieldLabel} не может быть больше ${max}`);
    }
    return null;
}

export const validateCalories = (calories: string): string | null => {
    return validateNumberInRange(calories, 1, 100000, 'Калории');
}

export const validateProteinGrams = (protein: string): string | null => {
    return validateNumberInRange(protein, 1, 1000, 'Белки (г)');
}

export const validateFatGrams = (fat: string): string | null => {
    return validateNumberInRange(fat, 1, 1000, 'Жиры (г)');
}

export const validateCarbGrams = (carb: string): string | null => {
    return validateNumberInRange(carb, 1, 1000, 'Углеводы (г)');
}

export const validateDayDescription = (description: string): string | null => {
    // Поле необязательное: если пусто — ок
    if (!description.trim()) {
        return null;
    }

    const maxLength = 500;
    if (description.length > maxLength) {
        return (`Описание не должно превышать ${maxLength} символов (сейчас ${description.length})`);
    }

    return null;
}
