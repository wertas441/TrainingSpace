import {
    ActivityExerciseRequest,
    AddActivityFrontendRequest,
    UpdateActivityFrontendRequest,
} from "../../types/activity";

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0;

export const validateActivityData = (activityData: AddActivityFrontendRequest): boolean => {
    if (!activityData) {
        return false;
    }

    const checks = [
        validateActivityName(activityData.activityName),
        validateActivityDescription(activityData.description),
        validateActivityType(activityData.activityType),
        validateActivityDifficult(activityData.activityDifficult),
        validateActivityTrainingId(activityData.trainingId),
        validateActivityPerformedAt(activityData.performedAt),
        validateActivityExercises(activityData.exercises),
    ];

    return checks.every(Boolean);
}

export const validateUpdateActivityData = (activityData: UpdateActivityFrontendRequest): boolean => {
    if (!activityData) {
        return false;
    }

    const checks = [
        validateActivityPublicId(activityData.publicId),
        validateActivityName(activityData.name),
        validateActivityDescription(activityData.description),
        validateActivityType(activityData.type),
        validateActivityDifficult(activityData.difficulty),
        validateActivityTrainingId(activityData.trainingId),
        validateActivityPerformedAt(activityData.activityDate),
        validateActivityExercises(activityData.exercises),
    ];

    return checks.every(Boolean);
}

export const validateActivityPublicId = (publicId: unknown): boolean => {
    return isNonEmptyString(publicId);
}

export const validateActivityName = (name: unknown): boolean => {
    if (!isNonEmptyString(name)) {
        return false;
    }

    if (name.length < 3) {
        return false;
    }

    if (name.length > 40) {
        return false;
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const activityNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if (!activityNameRegex.test(name)) {
        return false;
    }

    return true;
}

export const validateActivityDescription = (description: unknown): boolean => {
    if (typeof description !== 'string') {
        return false;
    }

    return description.length <= 500;
}

export const validateActivityType = (type: unknown): boolean => {
    return isNonEmptyString(type);
}

export const validateActivityDifficult = (difficult: unknown): boolean => {
    return isNonEmptyString(difficult);
}

export const validateActivityTrainingId = (trainingId: unknown): boolean => {
    return typeof trainingId === 'number' && Number.isFinite(trainingId) && trainingId > 0;
}

export const validateActivityPerformedAt = (performedAt: unknown): boolean => {
    if (!isNonEmptyString(performedAt)) {
        return false;
    }

    const parts = performedAt.split('-');
    if (parts.length !== 3) {
        return false;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const parsed = new Date(year, month, day);
    if (isNaN(parsed.getTime()) || parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
        return false;
    }

    return true;
}

export const validateActivityExercises = (exercises: ActivityExerciseRequest[]): boolean => {
    if (!Array.isArray(exercises) || exercises.length === 0) {
        return false;
    }

    for (const ex of exercises) {
        if (!ex || typeof ex.id !== 'number' || !Number.isFinite(ex.id) || ex.id <= 0) {
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
