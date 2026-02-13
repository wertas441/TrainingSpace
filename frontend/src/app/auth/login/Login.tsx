'use client'

import {useMemo} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import Link from "next/link";
import {validateUserName, validateUserPassword} from "@/lib/utils/validators/user";
import MainInput from "@/components/inputs/MainInput";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import {LockClosedIcon, UserIcon} from "@heroicons/react/24/outline";
import type {BackendApiResponse} from "@/types";
import {useForm} from "react-hook-form";
import {makeInitUserData, useUserStore} from "@/lib/store/userStore";

interface LoginFormValues {
    userName: string;
    password: string;
    rememberMe: boolean;
}

export default function Login(){

    const {register, handleSubmit, formState: { errors }} = useForm<LoginFormValues>()

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();
    const initUserData = useUserStore(makeInitUserData)

    const onSubmit = async (values: LoginFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            userName: values.userName,
            password: values.password,
            rememberMe: values.rememberMe,
        }

        try {
            await api.post<BackendApiResponse>('/user/login', payload)

            await initUserData();
            const userData = useUserStore.getState().userData;
            if (!userData) {
                setServerError("Не удалось получить данные пользователя после входа. Попробуйте обновить страницу.");
                setIsSubmitting(false);
                return;
            }

            router.replace("/");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('Login error:', err);

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

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    <MainInput
                        id={'userName'}
                        icon={useMemo(() => <UserIcon className="h-5 w-5 " />, [])}
                        label={'Имя пользователя'}
                        error={errors.userName?.message}
                        {...register('userName', {validate: (value) => validateUserName(value) || true})}
                    />

                    <MainInput
                        id={'password'}
                        type="password"
                        label={'Пароль'}
                        icon={useMemo(() => <LockClosedIcon className="h-5 w-5" />, [])}
                        error={errors.password?.message}
                        {...register('password', {validate: (value) => validateUserPassword(value) || true})}
                    />

                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                                {...register('rememberMe')}
                            />
                            <span className="block cursor-pointer text-xs sm:text-sm text-gray-700 dark:text-gray-400">Запомнить меня</span>
                        </label>

                        <div className="text-sm">
                            <Link href="/auth/forgot-password" className={`text-xs sm:text-sm font-medium textLinks`}>
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