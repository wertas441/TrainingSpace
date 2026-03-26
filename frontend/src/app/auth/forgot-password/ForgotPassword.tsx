'use client'

import {useState} from "react";
import {usePageUtils} from "@/shared/hooks/usePageUtils";
import {validateUserEmail} from "@/entities/user/model/validation";
import {serverApi, getServerErrorMessage, showErrorMessage} from "@/shared";
import BlockPageContext from "@/widgets/UiContex/BlockPageContext";
import ServerError from "@/shared/UI-kit/errors/ServerError";
import MainInput from "@/shared/UI-kit/inputs/MainInput";
import {AtSymbolIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useForm} from "react-hook-form";
import type {BackendApiResponse} from "@/shared/types";
import LightGreenBtn from "@/shared/UI-kit/buttons/LightGreenBtn";

interface ForgotPasswordForm {
    email: string;
}

export default function ForgotPassword() {

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>()

    const {serverError, setServerError, isSubmitting, setIsSubmitting} = usePageUtils();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (values: ForgotPasswordForm)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            email: values.email,
        }

        try {
            await serverApi.post<BackendApiResponse>('/user/forgot-password', payload)

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

                    <LightGreenBtn
                        label={!isSubmitting ? 'Отправить письмо' : 'Отправка...'}
                        type={`submit`}
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