'use client'

import {useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateUserEmail} from "@/lib/utils/validators";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {AtSymbolIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useForm} from "react-hook-form";
import type {BackendApiResponse} from "@/types/indexTypes";

interface ForgotPasswordFormValues {
    email: string;
}

export default function ForgotPassword() {

    const {register, handleSubmit, formState: { errors }} = useForm<ForgotPasswordFormValues>()

    const {serverError, setServerError, isSubmitting, setIsSubmitting} = usePageUtils();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (values: ForgotPasswordFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            email: values.email,
        }

        try {
            await api.post<BackendApiResponse>('/auth/forgot-password', payload)

            setSuccessMessage("Если указанный email зарегистрирован, мы отправили на него письмо с дальнейшими инструкциями по восстановлению пароля.");
            setIsSubmitting(false)
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('forgot password error:', err);

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

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <MainInput
                        id={'email'}
                        label={'Email'}
                        type="email"
                        icon={<AtSymbolIcon className="h-5 w-5"/>}
                        error={errors.email?.message}
                        {...register('email', {validate: (value) => validateUserEmail(value) || true})}
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