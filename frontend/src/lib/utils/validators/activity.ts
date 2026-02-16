import {ExerciseSetsByExerciseId} from "@/types/activity";

export const validateActivityName = (activityName: string): string | null => {
    if (!activityName.trim()) {
        return ('Пожалуйста, введите название активности');
    }

    if (activityName.length < 3) {
        return (`Название активности должно содержать минимум 3 символа (сейчас ${activityName.length})`);
    }

    if (activityName.length > 40) {
        return (`Название активности может содержать максимум 40 символов (сейчас ${activityName.length})`);
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