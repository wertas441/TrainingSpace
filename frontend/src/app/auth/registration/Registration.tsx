"use client"

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {
    validateConfirmPassword,
    validateUserEmail,
    validateUserName,
    validateUserPassword
} from "@/lib/utils/validators";
import {baseUrlForBackend} from "@/lib";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import {AtSymbolIcon, LockClosedIcon, UserIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import MainHideInput from "@/components/inputs/MainHideInput";

export default function Registration(){

    const userName = useInputField('');
    const email = useInputField('');
    const password = useInputField('');
    const confirmPassword = useInputField('');

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils()

    const validateForm = (): boolean => {
        const userNameError = validateUserName(userName.inputState.value);
        userName.setError(userNameError);

        const emailError = validateUserEmail(email.inputState.value);
        email.setError(emailError);

        const passwordError = validateUserPassword(password.inputState.value);
        password.setError(passwordError);

        const confirmPasswordError = validateConfirmPassword(password.inputState.value, confirmPassword.inputState.value);
        confirmPassword.setError(confirmPasswordError);

        return !(userNameError || emailError || passwordError || confirmPasswordError);
    }


    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/user/registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userName: userName.inputState.value,
                    email: email.inputState.value,
                    password: password.inputState.value,
                }),
            });

            if (result.ok) {
                router.replace("/");
                return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setServerError(result.message || "Ошибка регистрации. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Registration error:", error);
            setIsSubmitting(false);
        }
    }

    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl pb-2 font-bold text-center text-gray-900">
                        TrainingSpace
                    </h2>
                    <p className="text-center text-gray-600">
                        Введите данные для регистрации нового аккаунта
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-5" onSubmit={handleSubmit}>

                    <MainInput
                        id={'userName'}
                        value={userName.inputState.value}
                        onChange={userName.setValue}
                        icon={<UserIcon className="h-5 w-5 text-gray-500" />}
                        label={'Имя пользователя'}
                        error={userName.inputState.error || undefined}
                    />

                    <MainInput
                        id={'email'}
                        value={email.inputState.value}
                        type="email"
                        onChange={email.setValue}
                        icon={<AtSymbolIcon className="h-5 w-5 text-gray-500" />}
                        label={'Email'}
                        error={email.inputState.error || undefined}
                    />

                    <MainHideInput
                        id={'password'}
                        value={password.inputState.value}
                        onChange={password.setValue}
                        icon={<LockClosedIcon className="h-5 w-5 text-gray-500" />}
                        label={'Пароль'}
                        error={password.inputState.error || undefined}
                    />

                    <MainInput
                        id={'confirmPassword'}
                        type={'password'}
                        value={confirmPassword.inputState.value}
                        onChange={confirmPassword.setValue}
                        icon={<LockClosedIcon className="h-5 w-5 text-gray-500" />}
                        label={'Подтверждение пароля'}
                        error={confirmPassword.inputState.error || undefined}
                    />

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Зарегистрироваться' : 'Регистрация...'}
                        disabled={isSubmitting}
                    />
                </form>

                <div className="mt-4 text-sm text-gray-700 text-center">
                    Уже есть аккаунт? <Link href="/auth/login" className={`font-medium textLinks`}>Авторизуетесь</Link>
                </div>
            </div>
        </BlockPageContext>
    );
}
