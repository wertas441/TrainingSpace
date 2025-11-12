import {useInputField} from "@/lib/hooks/useInputField";
import MainHideInput from "@/components/inputs/MainHideInput";
import {validateConfirmPassword, validateUserPassword} from "@/lib/utils/validators";
import {FormEvent} from "react";
import {baseUrlForBackend} from "@/lib";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {MainInput} from "@/components/inputs/MainInput";

export default function ChangePasswordPage(){

    const currentPassword = useInputField('');
    const newPassword = useInputField('');
    const confirmPassword = useInputField('');

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const validateForm = () => {
        const currentPasswordError = validateUserPassword(currentPassword.inputState.value);
        currentPassword.setError(currentPasswordError);

        const newPasswordError = validateUserPassword(newPassword.inputState.value);
        newPassword.setError(newPasswordError);

        const confirmPasswordError = validateConfirmPassword(newPassword.inputState.value, confirmPassword.inputState.value);
        confirmPassword.setError(confirmPasswordError);

        return !(currentPasswordError || newPasswordError || confirmPasswordError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/user/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: currentPassword.inputState.value,
                    newPassword: newPassword.inputState.value,
                }),
            });

            if (result.ok) {
                router.push("/settings");
                return;
            }

            const data = await result.json().catch(() => null);
            setServerError((data && (data.error || data.message)) || "Ошибка смены пароля. Проверьте правильность введенных данных.");
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Change password error:", error);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={`max-w-lg text-black`}>
            <div className="mb-5">
                <p className="text-sm text-gray-600 mt-1">Введите текущий пароль и новый, затем подтвердите новый пароль.</p>
            </div>

            <ServerError message={serverError} />

            <form className="space-y-6" onSubmit={handleSubmit}>

                <MainInput
                    id={'currentPassword'}
                    type={'password'}
                    placeholder={'Ваш текущий пароль'}
                    value={currentPassword.inputState.value}
                    onChange={currentPassword.setValue}
                    error={currentPassword.inputState.error || undefined}
                />

                <MainHideInput
                    id={'newPassword'}
                    placeholder={'Новый пароль'}
                    value={newPassword.inputState.value}
                    onChange={newPassword.setValue}
                    error={newPassword.inputState.error || undefined}
                />

                <MainInput
                    id={'confirmPassword'}
                    type={'password'}
                    placeholder={'Подтверждение нового пароля'}
                    value={confirmPassword.inputState.value}
                    onChange={confirmPassword.setValue}
                    error={confirmPassword.inputState.error || undefined}
                />

                <div className="pt-2">
                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Сменить пароль' : 'Сохраняем...'}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    )
}