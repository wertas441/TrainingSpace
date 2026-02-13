'use client'

import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateUserEmail, validateUserPassword} from "@/lib/utils/validators/user";
import {useMemo} from "react";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import {LockClosedIcon, AtSymbolIcon} from "@heroicons/react/24/outline";
import SettingsPageContext from "@/components/UI/UiContex/SettingsPageContext";
import SettingsHeader from "@/components/UI/headers/SettingsHeader";
import {useForm} from "react-hook-form";
import type {BackendApiResponse} from "@/types";
import {useUserStore} from "@/lib/store/userStore";

interface ChangeEmailFormValues {
    newEmail: string;
    currentPassword: string;
}

export default function ChangeEmail(){

    const {register, handleSubmit, formState: { errors }} = useForm<ChangeEmailFormValues>()

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();
    const changeEmail = useUserStore((s) => s.changeEmail);

    const onSubmit = async (values: ChangeEmailFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            newEmail: values.newEmail,
            currentPassword: values.currentPassword,
        }

        try {
            await api.post<BackendApiResponse>('/user/change-email', payload)

            changeEmail(values.newEmail)
            router.push("/settings/profile");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('change email error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <SettingsPageContext>

            <SettingsHeader
                label={`Смена почты`}
                text={`Введите вашу новую почту, затем подтвердите изменение паролем`}
                IconComponent={AtSymbolIcon}
            />

            <div className="px-6 py-6 max-w-xl sm:px-8 sm:py-8">

                <ServerError message={serverError} />

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <MainInput
                        id={'newEmail'}
                        type={'email'}
                        label={'Новая почта'}
                        icon={useMemo(() => <AtSymbolIcon className="h-5 w-5 text-gray-500" />, [])}
                        error={errors.newEmail?.message}
                        {...register('newEmail', {validate: (value) => validateUserEmail(value) || true})}
                    />

                    <MainInput
                        id={'currentPassword'}
                        type={'password'}
                        label={'Ваш текущий пароль'}
                        icon={useMemo(() => <LockClosedIcon className="h-5 w-5 text-gray-500" />, [])}
                        error={errors.currentPassword?.message}
                        {...register('currentPassword', {validate: (value) => validateUserPassword(value) || true})}
                    />

                    <div className="pt-2">
                        <LightGreenSubmitBtn
                            label={!isSubmitting ? 'Сменить почту' : 'Сохраняем...'}
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </SettingsPageContext>
    )
}