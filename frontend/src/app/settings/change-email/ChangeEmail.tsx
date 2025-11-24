'use client'

import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {useInputField} from "@/lib/hooks/useInputField";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateUserEmail, validateUserPassword} from "@/lib/utils/validators";
import {FormEvent, useMemo} from "react";
import {baseUrlForBackend} from "@/lib";
import {LockClosedIcon, AtSymbolIcon} from "@heroicons/react/24/outline";

export default function ChangeEmail(){

    const currentEmail = useInputField('');
    const newEmail = useInputField('');
    const currentPassword = useInputField('');

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const validateForm = () => {
        const currentEmailError = validateUserEmail(currentEmail.inputState.value);
        currentEmail.setError(currentEmailError);

        const newEmailError = validateUserEmail(newEmail.inputState.value);
        newEmail.setError(newEmailError);

        const currentPasswordError = validateUserPassword(currentPassword.inputState.value);
        currentPassword.setError(currentPasswordError);

        return !(currentEmailError || newEmailError || currentPasswordError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/user/change-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentEmail: currentEmail.inputState.value,
                    newEmail: newEmail.inputState.value,
                    currentPassword: currentPassword.inputState.value,
                }),
            });

            if (result.ok) {
                router.push("/settings");
                return;
            }

            const data = await result.json().catch(() => null);
            setServerError((data && (data.error || data.message)) || "Ошибка смены почты. Проверьте правильность введенных данных.");
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Change email error:", error);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={`max-w-lg text-black`}>
            <div className="mb-5">
                <p className="text-sm text-gray-600 mt-1">Введите текущую почту и новую, затем подтвердите ваш пароль.</p>
            </div>

            <ServerError message={serverError} />

            <form className="space-y-4" onSubmit={handleSubmit}>

                <MainInput
                    id={'currentEmail'}
                    type={'email'}
                    label={'Ваша текущая почта'}
                    icon={useMemo(() => <AtSymbolIcon className="h-5 w-5 text-gray-500" />, [])}
                    value={currentEmail.inputState.value}
                    onChange={currentEmail.setValue}
                    error={currentEmail.inputState.error || undefined}
                />

                <MainInput
                    id={'newEmail'}
                    type={'email'}
                    icon={useMemo(() => <AtSymbolIcon className="h-5 w-5 text-gray-500" />, [])}
                    label={'Новая почта'}
                    value={newEmail.inputState.value}
                    onChange={newEmail.setValue}
                    error={newEmail.inputState.error || undefined}
                />

                <MainInput
                    id={'currentPassword'}
                    type={'password'}
                    label={'Ваш текущий пароль'}
                    icon={useMemo(() => <LockClosedIcon className="h-5 w-5 text-gray-500" />, [])}
                    value={currentPassword.inputState.value}
                    onChange={currentPassword.setValue}
                    error={currentPassword.inputState.error || undefined}
                />

                <div className="pt-2">
                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Сменить почту' : 'Сохраняем...'}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    )
}