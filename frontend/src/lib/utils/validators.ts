/// USER VALIDATOR

import {GoalPriority} from "@/types/goalTypes";
import {ExerciseSetsByExerciseId} from "@/types/activityTypes";

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

export const validateTwoPassword = (currentPassword:string, newPassword:string):string | null => {
    if (currentPassword === newPassword){
        return ('Ваш новый пароль такой же как и нынешний')
    }

    return null;
}


/// Nutrition Validators

export const validateDayName = (dayName: string): string | null => {
    if(!dayName.trim()){
        return ('Пожалуйста, введите наименование для дня')
    }

    if(dayName.length < 3){
        return (`Имя дня должно содержать минимум 3 символов (сейчас ${dayName.length})`)
    }

    if(dayName.length > 30){
        return (`Имя дня может содержать максимум 30 символов (сейчас ${dayName.length})`)
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


/// Goal Validators

export const validateGoalName = (goalName: string): string | null => {
    if (!goalName.trim()) {
        return ('Пожалуйста, введите название цели');
    }

    if (goalName.length < 3) {
        return (`Название цели должно содержать минимум 3 символа (сейчас ${goalName.length})`);
    }

    if (goalName.length > 30) {
        return (`Название цели может содержать максимум 30 символов (сейчас ${goalName.length})`);
    }

    const goalNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if (!goalNameRegex.test(goalName)) {
        return ('Название цели может содержать буквы (лат/кир), цифры, пробелы и некоторые спец.символы')
    }

    return null;
}

export const validateGoalDescription = (description: string): string | null => {
    if (!description.trim()) {
        return null;
    }

    if (description.length > 500) {
        return (`Описание не должно превышать 500 символов (сейчас ${description.length})`);
    }

    return null;
}

export const validateGoalPriority = (priority: GoalPriority): boolean => {
    if(!priority.trim()){
        return true;
    }

    return false;
}


/// Activity Validators

export const validateActivityName = (activityName: string): string | null => {
    if (!activityName.trim()) {
        return ('Пожалуйста, введите название активности');
    }

    if (activityName.length < 3) {
        return (`Название активности должно содержать минимум 3 символа (сейчас ${activityName.length})`);
    }

    if (activityName.length > 15) {
        return (`Название активности может содержать максимум 15 символов (сейчас ${activityName.length})`);
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const activityNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if (!activityNameRegex.test(activityName)) {
        return ('Название активности может содержать буквы (лат/кир), цифры, пробелы и некоторые спец.символы');
    }

    return null;
}

export const validateActivityDescription = (description: string): string | null => {
    // Поле опциональное
    if (!description.trim()) {
        return null;
    }

    const maxLength = 500;
    if (description.length > maxLength) {
        return (`Описание не должно превышать ${maxLength} символов (сейчас ${description.length})`);
    }

    return null;
}

export const validateActivityDate = (activityDate: string): string | null => {
    if (!activityDate.trim()) {
        return ('Пожалуйста, выберите дату активности');
    }

    const parts = activityDate.split('-');
    if (parts.length !== 3) {
        return ('Некорректная дата активности');
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1; // 0-11
    const day = Number(parts[2]);

    const parsed = new Date(year, month, day);
    if (isNaN(parsed.getTime()) || parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
        return ('Некорректная дата активности');
    }

    // Дополнительно не даём ставить дату в будущем — как для питания
    const todayLocal = new Date();
    const todayStart = new Date(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate());
    if (parsed.getTime() > todayStart.getTime()) {
        return ('Дата активности не может быть в будущем');
    }

    return null;
}

export const validateActivityTrainingId = (trainingId: string): string | null => {
    if (!trainingId.trim()) {
        return ('Пожалуйста, выберите тренировку‑шаблон');
    }

    if (!/^\d+$/.test(trainingId.trim())) {
        return ('Некорректный идентификатор тренировки');
    }

    const num = parseInt(trainingId.trim(), 10);
    if (num <= 0) {
        return ('Некорректный идентификатор тренировки');
    }

    return null;
}

export const validateActivitySets = (exerciseSets: ExerciseSetsByExerciseId): string | null => {
    // Игнорируем упражнения, в которых нет ни одного валидного подхода (вес/повторы > 0)
    const filteredExerciseIds: string[] = [];

    for (const [exIdStr, sets] of Object.entries(exerciseSets)) {
        const validSets = (sets || []).filter(
            (s) =>
                Number.isFinite(s.weight) &&
                s.weight > 0 &&
                Number.isFinite(s.quantity) &&
                s.quantity > 0
        );

        if (validSets.length > 0) {
            filteredExerciseIds.push(exIdStr);
        }
    }

    if (filteredExerciseIds.length === 0) {
        return ('Добавьте хотя бы одно упражнение и подход для активности');
    }

    // Дополнительная проверка сохранённых сетов (на случай некорректных значений)
    for (const exIdStr of filteredExerciseIds) {
        const sets = exerciseSets[Number(exIdStr)] || [];

        for (const s of sets) {
            if (!Number.isFinite(s.weight) || s.weight <= 0) {
                return ('Вес в подходах не может быть отрицательным или равным 0');
            }
            if (!Number.isFinite(s.quantity) || s.quantity <= 0) {
                return ('Количество повторений в подходах должно быть больше 0');
            }
        }
    }

    return null;
}


