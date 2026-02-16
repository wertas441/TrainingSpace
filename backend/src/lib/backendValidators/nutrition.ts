import {AddNewDayFrontendStructure} from "../../types/nutrition";

export const validateNutritionDayData = (dayData: AddNewDayFrontendStructure) => {

    if (!dayData) {
        return false;
    }

    const checks = [
        validateDayName(dayData.name),
        validateDayDescription(dayData.description),
        validateCalories(dayData.calories),
        validateProtein(dayData.protein),
        validateFat(dayData.fat),
        validateCarb(dayData.carb),
        validateNutritionDayDate(dayData.date),
    ].flat();

    return checks.every(Boolean);
}

const validateDayName = (dayName: string): boolean => {
    if(!dayName.trim()){
        return false;
    }

    if(dayName.length < 3){
        return false;
    }

    if(dayName.length > 40){
        return false;
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const dayNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if(!dayNameRegex.test(dayName)) {
        return false;
    }

    return true;
}

const validateNutritionDayDate = (dayDate: string): boolean => {
    if (!dayDate.trim()) {
        return false;
    }

    const parts = dayDate.split('-');
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

    const todayLocal = new Date();
    const todayStart = new Date(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate());

    if (parsed.getTime() > todayStart.getTime()) {
        return false;
    }

    return true;
}

const validateNumberInRange = (value: number, min: number, max: number): boolean => {
    if (value == 0) {
        return false;
    }

    if (value < min) {
        return false;
    }
    if (value > max) {
        return false;
    }
    return true;
}

const validateCalories = (calories: number): boolean => {
    return validateNumberInRange(calories, 1, 100000);
}

const validateProtein = (protein: number): boolean => {
    return validateNumberInRange(protein, 1, 1000);
}

const validateFat = (fat: number): boolean => {
    return validateNumberInRange(fat, 1, 1000);
}

const validateCarb = (carb: number): boolean => {
    return validateNumberInRange(carb, 1, 1000);
}

const validateDayDescription = (description: string): boolean => {
    if (description.length > 500) {
        return false;
    }

    return true;
}