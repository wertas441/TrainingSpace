'use client'

import MainHideInput from "@/components/inputs/MainHideInput";
import {
    validateConfirmPassword, validateNewPassword,
    validateUserPassword
} from "@/lib/utils/validators";
import {useMemo} from "react";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import MainInput from "@/components/inputs/MainInput";
import {LockClosedIcon, CheckIcon} from "@heroicons/react/24/outline";
import SettingsPageContext from "@/components/UI/UiContex/SettingsPageContext";
import SettingsHeader from "@/components/UI/headers/SettingsHeader";
import {useForm} from "react-hook-form";
import type {BackendApiResponse} from "@/types/indexTypes";

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePassword(){

    const {register, handleSubmit, getValues, formState: { errors }} = useForm<ChangePasswordFormValues>()

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const onSubmit = async (values: ChangePasswordFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        }

        try {
            await api.post<BackendApiResponse>('/settings/change-password', payload)

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

            <div className="px-6 py-6 max-w-xl sm:px-8 sm:py-8">
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
                        />
                    </div>
                </form>
            </div>
        </SettingsPageContext>
    )
}