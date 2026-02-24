'use client'

import MainHideInput from "@/components/inputs/MainHideInput";
import {
    validateConfirmPassword, validateNewPassword,
    validateUserPassword
} from "@/lib/utils/validators/user";
import {useMemo} from "react";
import {serverApi, getServerErrorMessage, showErrorMessage} from "@/lib";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import MainInput from "@/components/inputs/MainInput";
import {
    CheckCircleIcon,
    CheckIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import SettingsPageContext from "@/components/UI/UiContex/SettingsPageContext";
import SettingsHeader from "@/components/UI/headers/SettingsHeader";
import {useForm} from "react-hook-form";
import type {BackendApiResponse} from "@/types";

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePassword(){

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ChangePasswordFormValues>()

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router}  = usePageUtils();

    const onSubmit = async (values: ChangePasswordFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        }

        try {
            await serverApi.post<BackendApiResponse>('/user/change-password', payload)

            router.push("/settings/profile");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('change password error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <SettingsPageContext>

            <SettingsHeader
                label={`Смена пароля`}
                text={`Введите текущий пароль и новый, затем подтвердите новый пароль`}
                IconComponent={LockClosedIcon}
            />

            <div className="px-6 py-6 sm:px-8 sm:py-8">
                <div className="mx-auto grid w-full max-w-7xl items-start gap-5 xl:grid-cols-2">
                    <section className="rounded-2xl border border-gray-100 bg-white/80 p-5 dark:border-neutral-700 dark:bg-neutral-900/70 sm:p-6">
                        <ServerError message={serverError} />

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <MainInput
                                id={'currentPassword'}
                                type={'password'}
                                label={'Ваш текущий пароль'}
                                icon={useMemo(() => <LockClosedIcon className="h-5 w-5 text-gray-500" />, [])}
                                error={errors.currentPassword?.message}
                                {...register('currentPassword', {validate: (value) => validateUserPassword(value) || true})}
                            />

                            <MainHideInput
                                id={'newPassword'}
                                label={'Новый пароль'}
                                icon={useMemo(() => <LockClosedIcon className="h-5 w-5 text-gray-500" />, [])}
                                error={errors.newPassword?.message}
                                {...register('newPassword', {validate: (value) => validateNewPassword(value) || true})}
                            />

                            <MainInput
                                id={'confirmPassword'}
                                type={'password'}
                                label={'Подтверждение нового пароля'}
                                icon={useMemo(() => <CheckIcon className="h-5 w-5 text-gray-500" />, [])}
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword', {
                                    validate: (value) =>
                                        validateConfirmPassword(getValues("newPassword"), value) || true,
                                })}
                            />

                            <div className="pt-2">
                                <LightGreenSubmitBtn
                                    label={!isSubmitting ? 'Сменить пароль' : 'Сохраняем...'}
                                    disabled={isSubmitting}
                                    className="py-2.5"
                                />
                            </div>
                        </form>
                    </section>

                    <aside className="relative self-start overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-5 text-white shadow-sm dark:border-neutral-700 sm:p-6">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
                        <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl" />

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="space-y-6">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                                    <SparklesIcon className="h-4 w-4" />
                                    Безопасность аккаунта
                                </div>

                                <h2 className="text-xl font-bold leading-tight sm:text-2xl">
                                    Обновляйте пароль регулярно и снижайте риск доступа к аккаунту
                                </h2>

                                <div className="grid gap-4">
                                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <ShieldCheckIcon className="h-5 w-5 shrink-0" />
                                            Новый пароль должен отличаться от старого
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <CheckCircleIcon className="h-5 w-5 shrink-0" />
                                            Подтверждение помогает избежать опечаток
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-emerald-50/95">
                                После сохранения вы вернетесь в профиль с обновленными данными безопасности.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </SettingsPageContext>
    )
}