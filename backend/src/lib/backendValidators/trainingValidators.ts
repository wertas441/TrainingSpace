export const validateTrainingName = (trainingName: string): boolean => {
    if (!trainingName.trim()) {
        return false;
    }

    if (trainingName.length < 3) {
        return false;
    }

    if (trainingName.length > 30) {
        return false;
    }

    const trainingNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if (!trainingNameRegex.test(trainingName)) {
        return false;
    }

    return true;
}

export const validateTrainingDescription = (description: string): boolean => {
    // Необязательное поле
    if (!description.trim()) {
        return true;
    }

    if (description.length > 500) {
        return false;
    }

    return true;
}

export const validateTrainingExercises = (exerciseIds: number[]): boolean => {

    if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
        return false;
    }

    if (exerciseIds.length > 20) {
        return false;
    }

    // Проверка на уникальность id
    const unique = new Set(exerciseIds);
    if (unique.size !== exerciseIds.length) {
        return false;
    }

    return true;
}