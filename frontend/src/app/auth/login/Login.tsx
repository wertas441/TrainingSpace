'use client'

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
import {Controller, useForm} from "react-hook-form";

interface LoginFormValues {
    userName: string;
    password: string;
    rememberMe: boolean;
}

export default function Login(){

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const {control, handleSubmit,} = useForm<LoginFormValues>({
        defaultValues: {
            userName: '',
            password: '',
            rememberMe: false,
        }
    });

    const onSubmit = async (data: LoginFormValues):Promise<void> => {
        setServerError(null);
        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userName: data.userName,
                    password: data.password,
                    rememberMe: data.rememberMe,
                }),
            });

            if (result.ok) {
                router.replace("/");
                return;
            }

            const responseData = await result.json() as BackendApiResponse;
            setServerError(responseData.error || responseData.message || "Ошибка авторизации. Проверьте правильность введенных данных.");
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

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    <Controller
                        name="userName"
                        control={control}
                        rules={{
                            validate: (value) => validateUserName(value) || true,
                        }}
                        render={({ field, fieldState }) => (
                            <MainInput
                                id={'userName'}
                                value={field.value}
                                onChange={field.onChange}
                                icon={<UserIcon className="h-5 w-5 text-gray-500" />}
                                label={'Имя пользователя'}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            validate: (value) => validateUserPassword(value) || true,
                        }}
                        render={({ field, fieldState }) => (
                            <MainInput
                                id={'password'}
                                type="password"
                                value={field.value}
                                onChange={field.onChange}
                                icon={<LockClosedIcon className="h-5 w-5 text-gray-500" />}
                                label={'Пароль'}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
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
                        )}
                    />

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
