export const validateUserPassword = (password: string):boolean => {
    if (!password.trim()){
        return false;
    }

    if (password.length < 8)  {
        return false;
    }

    if (password.length > 25){
        return false;
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*.]+$/;
    if(!passwordRegex.test(password)) {
        return false;
    }

    return true;
}

export const validateConfirmPassword = (password:string, confirmPassword:string):boolean => {
    if (!password.trim()){
        return false;
    }

    if (password != confirmPassword){
        return false;
    }

    return true;
}

export const validateTwoPassword = (currentPassword:string, newPassword:string):boolean => {
    if (currentPassword === newPassword){
        return false;
    }

    return true;
}