"use client"

import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {
    validateConfirmPassword,
    validateUserEmail,
    validateUserName,
    validateUserPassword
} from "@/lib/utils/validators/user";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import {AtSymbolIcon, LockClosedIcon, UserIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import MainHideInput from "@/components/inputs/MainHideInput";
import type {BackendApiResponse} from "@/types";
import {useForm} from "react-hook-form";

interface RegistrationFormValues {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Registration(){

    const {register, handleSubmit, getValues, formState: { errors }} = useForm<RegistrationFormValues>()

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils()

    const onSubmit = async (values: RegistrationFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        }

        try {
            await api.post<BackendApiResponse>('/user/registration', payload)

            router.push("/auth/login");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('Registration error:', err);

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
                        Введите данные для регистрации нового аккаунта
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    <MainInput
                        id={'userName'}
                        label={'Имя пользователя'}
                        icon={<UserIcon className="h-5 w-5" />}
                        error={errors.userName?.message}
                        {...register('userName', {validate: (value) => validateUserName(value) || true})}
                    />

                    <MainInput
                        id={'email'}
                        type="email"
                        label={'Email'}
                        icon={<AtSymbolIcon className="h-5 w-5" />}
                        error={errors.email?.message}
                        {...register('email', {validate: (value) => validateUserEmail(value) || true})}
                    />

                    <MainHideInput
                        id={'password'}
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        label={'Пароль'}
                        error={errors.password?.message}
                        {...register('password', {validate: (value) => validateUserPassword(value) || true})}
                    />

                    <MainInput
                        id={'confirmPassword'}
                        type={'password'}
                        label={'Подтверждение пароля'}
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            validate: (value) =>
                                validateConfirmPassword(getValues("password"), value) || true,
                        })}
                    />

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Зарегистрироваться' : 'Регистрация...'}
                        disabled={isSubmitting}
                    />
                </form>

                <div className="mt-4 text-sm text-gray-700 dark:text-gray-400 text-center">
                    Уже есть аккаунт? <Link href="/auth/login" className={`font-medium textLinks`}>Авторизуетесь</Link>
                </div>
            </div>
        </BlockPageContext>
    );
}
