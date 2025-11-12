/// USER VALIDATOR

export const validateUserName = (userName: string): string | null => {
    if(!userName.trim()){
        return ('Пожалуйста, введите имя для вашего аккаунта')
    }

    if(userName.length < 3){
        return (`Имя аккаунта должно содержать минимум 3 символов (сейчас ${userName.length})`)
    }

    if(userName.length > 15){
        return (`Имя аккаунта может содержать максимум 15 символов (сейчас ${userName.length})`)
    }

    const userNameRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if(!userNameRegex.test(userName)) {
        return ('Имя аккаунта может содержать только латинские буквы, цифры и некоторые спец.символы')
    }

    return null;
}

export const validateUserEmail = (email: string): string | null => {
    if (!email.trim()){
        return ('Пожалуйста, введите ваш email');
    }

    return null;
};

export const validateUserPassword = (password: string):string | null => {
    if (!password.trim()){
        return ('Пожалуйста, введите ваш пароль');
    }

    if (password.length < 8)  {
        return (`Пароль должен содержать минимум 8 символов (сейчас ${password.length})`);
    }

    if (password.length > 25){
        return (`Пароль может быть максимум 25 символов (сейчас ${password.length})`);
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if(!passwordRegex.test(password)) {
        return ('Пароль может содержать только латинские буквы, цифры и некоторые спец.символы')
    }
    return null;
}

export const validateConfirmPassword = (password:string, confirmPassword:string):string | null => {
    if (!password.trim()){
        return ('Пожалуйста, подтвердите ваш пароль');
    }

    if (password != confirmPassword){
        return ('Пароль не совпадает с тем, что вы ввели ранее')
    }

    return null;
}


/// Nutrition Validators

export const validateDayName = (dayName: string): string | null => {
    if(!dayName.trim()){
        return ('Пожалуйста, введите имя для дня')
    }

    if(dayName.length < 3){
        return (`Имя дня должно содержать минимум 3 символов (сейчас ${dayName.length})`)
    }

    if(dayName.length > 15){
        return (`Имя дня может содержать максимум 15 символов (сейчас ${dayName.length})`)
    }

    const dayNameRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if(!dayNameRegex.test(dayName)) {
        return ('Имя дня может содержать только латинские буквы, цифры и некоторые спец.символы')
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
    return validateNumberInRange(calories, 0, 100000, 'Калории');
}

export const validateProteinGrams = (protein: string): string | null => {
    return validateNumberInRange(protein, 0, 1000, 'Белки (г)');
}

export const validateFatGrams = (fat: string): string | null => {
    return validateNumberInRange(fat, 0, 1000, 'Жиры (г)');
}

export const validateCarbGrams = (carb: string): string | null => {
    return validateNumberInRange(carb, 0, 1000, 'Углеводы (г)');
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

/// Training Validators
export const validateTrainingName = (trainingName: string): string | null => {
    if (!trainingName.trim()) {
        return ('Пожалуйста, введите имя тренировки');
    }

    if (trainingName.length < 3) {
        return (`Имя тренировки должно содержать минимум 3 символа (сейчас ${trainingName.length})`);
    }

    if (trainingName.length > 30) {
        return (`Имя тренировки может содержать максимум 30 символов (сейчас ${trainingName.length})`);
    }

    // Разрешаем латиницу, цифры и базовые спецсимволы как в остальных валидаторах
    const trainingNameRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if (!trainingNameRegex.test(trainingName)) {
        return ('Имя тренировки может содержать только латинские буквы, цифры и некоторые спец.символы');
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
    return null;
}