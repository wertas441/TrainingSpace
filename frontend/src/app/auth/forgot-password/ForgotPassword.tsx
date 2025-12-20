'use client'

import {FormEvent, useState} from "react";
import {useInputField} from "@/lib/hooks/useInputField";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateUserEmail} from "@/lib/utils/validators";
import {baseUrlForBackend} from "@/lib";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {AtSymbolIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import type {BackendApiResponse} from "@/types/indexTypes";

export default function ForgotPassword() {

    const email = useInputField('');
    const {serverError, setServerError, isSubmitting, setIsSubmitting} = usePageUtils();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const validateForm = (): boolean => {
        const emailError = validateUserEmail(email.inputState.value);
        email.setError(emailError);

        return !emailError;
    };

    const handleSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setServerError(null);
        setSuccessMessage(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email.inputState.value,
                }),
            });

            if (result.ok) {
                setSuccessMessage("Если указанный email зарегистрирован, мы отправили на него письмо с дальнейшими инструкциями по восстановлению пароля.");
                setIsSubmitting(false);
                return;
            }

            setServerError("Функция в разработке");
            // const data = await result.json() as BackendApiResponse;
            // setServerError(data.error || data.message || "Не удалось отправить письмо для восстановления пароля. Попробуйте позже.");
            setIsSubmitting(false);
        } catch (error) {
            console.error("ForgotPassword error:", error);
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            setIsSubmitting(false);
        }
    };

    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl pb-2 font-bold text-center text-gray-900 dark:text-white">
                        TrainingSpace
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Восстановление доступа к аккаунту
                    </p>
                </div>

                <ServerError message={serverError} />

                {successMessage && (
                    <div
                        className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        {successMessage}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <MainInput
                        id={'email'}
                        value={email.inputState.value}
                        type="email"
                        onChange={email.setValue}
                        icon={<AtSymbolIcon className="h-5 w-5"/>}
                        label={'Email'}
                        error={email.inputState?.error}
                    />

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Отправить письмо' : 'Отправка...'}
                        disabled={isSubmitting}
                    />
                </form>

                <div className="mt-4 text-sm text-gray-700 dark:text-gray-400 text-center">
                    Вспомнили пароль?{" "}
                    <Link href="/auth/login" className={`font-medium textLinks`}>
                        Войти
                    </Link>
                </div>
            </div>
        </BlockPageContext>
    );
}