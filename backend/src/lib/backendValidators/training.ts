import {AddTrainingFrontendStructure} from "../../types/training";

export const validateTrainingData = (trainingData: AddTrainingFrontendStructure) => {

    if (!trainingData) {
        return false;
    }

    const checks = [
        validateTrainingName(trainingData.name),
        validateTrainingDescription(trainingData.description),
        validateTrainingExercises(trainingData.exercises),
    ].flat();

    return checks.every(Boolean);
}

const validateTrainingName = (trainingName: string): boolean => {
    if (!trainingName.trim()) {
        return false;
    }

    if (trainingName.length < 3) {
        return false;
    }

    if (trainingName.length > 40) {
        return false;
    }

    const trainingNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if (!trainingNameRegex.test(trainingName)) {
        return false;
    }

    return true;
}

const validateTrainingDescription = (description: string): boolean => {
    // Необязательное поле
    if (!description.trim()) {
        return true;
    }

    if (description.length > 500) {
        return false;
    }

    return true;
}

const validateTrainingExercises = (exerciseIds: number[]): boolean => {

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