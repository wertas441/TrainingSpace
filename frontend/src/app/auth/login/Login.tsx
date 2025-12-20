'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import Link from "next/link";
import {validateUserName, validateUserPassword} from "@/lib/utils/validators";
import MainInput from "@/components/inputs/MainInput";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {baseUrlForBackend} from "@/lib";
import {LockClosedIcon, UserIcon} from "@heroicons/react/24/outline";
import type {BackendApiResponse} from "@/types/indexTypes";

export default function Login(){

    const userName = useInputField('');
    const password = useInputField('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const validateForm = () => {
        const userNameError = validateUserName(userName.inputState.value);
        userName.setError(userNameError);

        const passwordError = validateUserPassword(password.inputState.value);
        password.setError(passwordError);

        return !(userNameError || passwordError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userName: userName.inputState.value,
                    password: password.inputState.value,
                    rememberMe: rememberMe,
                }),
            });

            if (result.ok) {
                router.replace("/");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка авторизации. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Login error:", error);
            setIsSubmitting(false);
        }
    }

    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl pb-2 font-bold text-center text-gray-900 dark:text-white">
                        TrainingSpace
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Войдите в свой аккаунт
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-5" onSubmit={handleSubmit}>

                    <MainInput
                        id={'userName'}
                        value={userName.inputState.value}
                        onChange={userName.setValue}
                        icon={useMemo(() => <UserIcon className="h-5 w-5 " />, [])}
                        label={'Имя пользователя'}
                        error={userName.inputState?.error}
                    />

                    <MainInput
                        id={'password'}
                        type="password"
                        value={password.inputState.value}
                        onChange={password.setValue}
                        icon={useMemo(() => <LockClosedIcon className="h-5 w-5" />, [])}
                        label={'Пароль'}
                        error={password.inputState?.error}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="block ml-2 cursor-pointer text-sm text-gray-700 dark:text-gray-400">
                                Запомнить меня
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/auth/forgot-password" className={`font-medium textLinks `}>
                                Забыли пароль?
                            </Link>
                        </div>
                    </div>

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Войти' : 'Вход...'}
                        disabled={isSubmitting}
                    />
                </form>

                <div className="mt-4 text-sm text-gray-700 dark:text-gray-400 text-center">
                    Нет аккаунта? <Link href="/auth/registration" className={`font-medium textLinks`}>Зарегистрироваться</Link>
                </div>
            </div>
        </BlockPageContext>
    );
}