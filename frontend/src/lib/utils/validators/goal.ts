import {GoalPriority} from "@/types/goal";

export const validateGoalName = (goalName: string): string | null => {
    if (!goalName.trim()) {
        return ('Пожалуйста, введите название цели');
    }

    if (goalName.length < 3) {
        return (`Название цели должно содержать минимум 3 символа (сейчас ${goalName.length})`);
    }

    if (goalName.length > 40) {
        return (`Название цели может содержать максимум 40 символов (сейчас ${goalName.length})`);
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