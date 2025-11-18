'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import Link from "next/link";
import {validateUserEmail, validateUserPassword} from "@/lib/utils/validators";
import MainInput from "@/components/inputs/MainInput";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {baseUrlForBackend} from "@/lib";
import {AtSymbolIcon, LockClosedIcon} from "@heroicons/react/24/outline";

export default function Login(){

    const email = useInputField('');
    const password = useInputField('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const validateForm = () => {
        const emailError = validateUserEmail(email.inputState.value);
        email.setError(emailError);

        const passwordError = validateUserPassword(password.inputState.value);
        password.setError(passwordError);

        return !(emailError || passwordError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/user/authorize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email.inputState.value,
                    password: password.inputState.value,
                    rememberMe: rememberMe,
                }),
            });

            if (result.ok) {
                router.replace("/");
                return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setServerError(result.message || "Ошибка авторизации. Проверьте правильность введенных данных.");
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Login error:", error);
            setIsSubmitting(false);
        } finally {
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
                        Войдите в свой аккаунт
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-6" onSubmit={handleSubmit}>

                    <MainInput
                        id={'email'}
                        type="email"
                        value={email.inputState.value}
                        onChange={email.setValue}
                        icon={useMemo(() => <AtSymbolIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Email'}
                        error={email.inputState.error || undefined}
                    />

                    <MainInput
                        id={'password'}
                        type="password"
                        value={password.inputState.value}
                        onChange={password.setValue}
                        icon={useMemo(() => <LockClosedIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Пароль'}
                        error={password.inputState.error || undefined}
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
                            <label htmlFor="remember-me" className="block ml-2 cursor-pointer text-sm text-gray-700">
                                Запомнить меня
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/auth/forgot-password" className={`font-medium textLinks`}>
                                Забыли пароль?
                            </Link>
                        </div>
                    </div>

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Войти' : 'Вход...'}
                        disabled={isSubmitting}
                    />
                </form>

                <div className="mt-4 text-sm text-gray-700 text-center">
                    Нет аккаунта? <Link href="/auth/registration" className={`font-medium textLinks`}>Зарегистрироваться</Link>
                </div>
            </div>
        </BlockPageContext>
    );
}
