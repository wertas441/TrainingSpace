import {GoalPriority} from "../../types/goal";

export const validateGoalName = (goalName: string): boolean => {
    if(!goalName.trim()){
        return false;
    }

    if(goalName.length < 3){
        return false;
    }

    if(goalName.length > 40){
        return false;
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const goalNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if(!goalNameRegex.test(goalName)) {
        return false;
    }

    return true;
}

export const validateGoalDescription = (description: string): boolean => {
    if (description.length > 500) {
        return false;
    }

    return true;
}

export const validateGoalPriority = (priority: GoalPriority): boolean => {
    if(!priority.trim()){
        return false;
    }

    return true;
}
