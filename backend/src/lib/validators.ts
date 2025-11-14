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

