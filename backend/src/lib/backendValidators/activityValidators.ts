import {
    ActivityDifficultyStructure,
    ActivityTypeStructure,
    ActivityExerciseRequest,
    ActivityExerciseFrontend
} from "../../types/activityBackendTypes";

export const validateActivityName = (goalName: string): boolean => {
    if(!goalName.trim()){
        return false;
    }

    if(goalName.length < 3){
        return false;
    }

    if(goalName.length > 15){
        return false;
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const activityNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if(!activityNameRegex.test(goalName)) {
        return false;
    }

    return true;
}

export const validateActivityDescription = (description: string): boolean => {
    if (description.length > 500) {
        return false;
    }

    return true;
}

export const validateActivityType = (type: ActivityTypeStructure): boolean => {
    if(!type.trim()){
        return false;
    }

    return true;
}

export const validateActivityDifficult = (difficult: ActivityDifficultyStructure ): boolean => {
    if(!difficult.trim()){
        return false;
    }

    return true;
}

export const validateActivityTrainingId = (trainingId: number ): boolean => {
    if(trainingId <= 0){
        return false;
    }

    return true;
}

export const validateActivityPerformedAt = (performedAt: string): boolean => {
    if (!performedAt.trim()) {
        return false;
    }

    const parts = performedAt.split('-');
    if (parts.length !== 3) {
        return false;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1; // 0-11
    const day = Number(parts[2]);

    const parsed = new Date(year, month, day);
    if (isNaN(parsed.getTime()) || parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
        return false;
    }

    return true;
}

// Валидация упражнений и подходов при создании активности (frontend -> backend)
export const validateActivityExercisesCreate = (exercises: ActivityExerciseRequest[]): boolean => {
    if (!Array.isArray(exercises) || exercises.length === 0) {
        return false;
    }

    for (const ex of exercises) {
        if (!ex || typeof ex.id !== 'number' || ex.id <= 0) {
            return false;
        }

        if (!Array.isArray(ex.try) || ex.try.length === 0) {
            return false;
        }

        for (const s of ex.try) {
            // Номер подхода должен быть положительным целым
            if (typeof s.id !== 'number' || !Number.isFinite(s.id) || s.id <= 0) {
                return false;
            }

            // Вес не может быть отрицательным
            if (typeof s.weight !== 'number' || !Number.isFinite(s.weight) || s.weight < 0) {
                return false;
            }

            // Повторения должны быть > 0
            if (typeof s.quantity !== 'number' || !Number.isFinite(s.quantity) || s.quantity <= 0) {
                return false;
            }
        }
    }

    return true;
}

// Валидация упражнений и подходов при обновлении активности
export const validateActivityExercisesUpdate = (exercises: ActivityExerciseFrontend[]): boolean => {
    if (!Array.isArray(exercises) || exercises.length === 0) {
        return false;
    }

    for (const ex of exercises) {
        if (!ex || typeof ex.exercisesId !== 'number' || ex.exercisesId <= 0) {
            return false;
        }

        if (!Array.isArray(ex.try) || ex.try.length === 0) {
            return false;
        }

        for (const s of ex.try) {
            if (typeof s.id !== 'number' || !Number.isFinite(s.id) || s.id <= 0) {
                return false;
            }

            if (typeof s.weight !== 'number' || !Number.isFinite(s.weight) || s.weight < 0) {
                return false;
            }

            if (typeof s.quantity !== 'number' || !Number.isFinite(s.quantity) || s.quantity <= 0) {
                return false;
            }
        }
    }

    return true;
}
