export const userNameValidator = (userName:string): boolean => {
    if(!userName.trim()){
        return false;
    }

    if(userName.length < 3){
        return false;
    }

    if(userName.length > 15){
        return false;
    }

    const userNameRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if(!userNameRegex.test(userName)) {
        return false;
    }

    return true;
}

export const userEmailValidator = (userEmail:string):boolean => {
    if (!userEmail.trim()) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return false;
    }

    if (userEmail.length > 254) {
        return false;
    }

    return true;
}

export const userPasswordValidator = (userPassword: string): boolean  => {
    if (!userPassword.trim()){
        return false;
    }

    if (userPassword.length < 8)  {
        return false;
    }

    if (userPassword.length > 25){
        return false;
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if(!passwordRegex.test(userPassword)) {
        return false;
    }

    return true;
}


/// Nutrition Validators
export const validateDayName = (dayName: string): boolean => {
    if(!dayName.trim()){
        return false;
    }

    if(dayName.length < 3){
        return false;
    }

    if(dayName.length > 15){
        return false;
    }

    // Разрешаем латиницу, кириллицу, цифры, пробел и часть спецсимволов
    const dayNameRegex = /^[a-zA-Z\u0400-\u04FF0-9 !@#$%^&*.]+$/u;
    if(!dayNameRegex.test(dayName)) {
        return false;
    }

    return true;
}

export const validateNutritionDay = (dayDate: string): boolean => {
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

export const validateCalories = (calories: number): boolean => {
    return validateNumberInRange(calories, 0, 100000);
}

export const validateProtein = (protein: number): boolean => {
    return validateNumberInRange(protein, 0, 1000);
}

export const validateFat = (fat: number): boolean => {
    return validateNumberInRange(fat, 0, 1000);
}

export const validateCarb = (carb: number): boolean => {
    return validateNumberInRange(carb, 0, 1000);
}

export const validateDayDescription = (description: string): boolean => {
    if (description.length > 500) {
        return false;
    }

    return true;
}

