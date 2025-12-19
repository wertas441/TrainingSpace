'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import {FormEvent} from "react";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {baseUrlForBackend} from "@/lib";
import {
    validateCalories,
    validateCarbGrams,
    validateDayDate,
    validateDayName,
    validateFatGrams,
    validateProteinGrams,
    validateDayDescription
} from "@/lib/utils/validators";
import MainTextarea from "@/components/inputs/MainTextarea";
import MainInput from "@/components/inputs/MainInput";
import type {BackendApiResponse} from "@/types/indexTypes";

export default function AddNutrition(){

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const dayName = useInputField("");
    const dayDescription = useInputField("");
    const calories = useInputField("");
    const protein = useInputField("");
    const fat = useInputField("");
    const carb = useInputField("");
    const dayDate = useInputField(initialDate);

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const validateForm = (): boolean => {
        const dayNameError = validateDayName(dayName.inputState.value);
        dayName.setError(dayNameError);

        const caloriesError = validateCalories(calories.inputState.value);
        calories.setError(caloriesError);

        const proteinError = validateProteinGrams(protein.inputState.value);
        protein.setError(proteinError);

        const fatError = validateFatGrams(fat.inputState.value);
        fat.setError(fatError);

        const carbError = validateCarbGrams(carb.inputState.value);
        carb.setError(carbError);

        const dateError = validateDayDate(dayDate.inputState.value);
        dayDate.setError(dateError);

        const descriptionError = validateDayDescription(dayDescription.inputState.value);
        dayDescription.setError(descriptionError);

        return !(dayNameError || caloriesError || proteinError || fatError || carbError || dateError || descriptionError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/nutrition/add-new-day`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: dayName.inputState.value,
                    description: dayDescription.inputState.value,
                    date: dayDate.inputState.value,
                    calories: parseInt(calories.inputState.value, 10),
                    protein: parseInt(protein.inputState.value, 10),
                    fat: parseInt(fat.inputState.value, 10),
                    carb: parseInt(carb.inputState.value, 10),
                }),
            });

            if (result.ok) {
                router.push("/nutrition");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка добавление дня. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Add nutrition day error:", error);
            setIsSubmitting(false);
        }
    }


    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className={`text-2xl pb-2 font-semibold text-center text-gray-900 dark:text-white`}>
                        Добавить день питания
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Заполните данные для отслеживания
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <MainInput
                        id={'dayName'}
                        value={dayName.inputState.value}
                        onChange={dayName.setValue}
                        label={'Наименование дня'}
                        error={dayName.inputState.error}
                    />

                    <MainInput
                        id={'calories'}
                        value={calories.inputState.value}
                        onChange={calories.setValue}
                        label={'Калории (ккал)'}
                        error={calories.inputState.error}
                    />

                    <MainInput
                        id={'protein'}
                        value={protein.inputState.value}
                        onChange={protein.setValue}
                        label={'Белки (г)'}
                        error={protein.inputState.error}
                    />

                    <MainInput
                        id={'fat'}
                        value={fat.inputState.value}
                        onChange={fat.setValue}
                        label={'Жиры (г)'}
                        error={fat.inputState.error}
                    />

                    <MainInput
                        id={'carb'}
                        value={carb.inputState.value}
                        onChange={carb.setValue}
                        label={'Углеводы (г)'}
                        error={carb.inputState.error}
                    />

                    <MainInput
                        id={'dayDate'}
                        type={'date'}
                        value={dayDate.inputState.value}
                        onChange={dayDate.setValue}
                        label={'Дата'}
                        error={dayDate.inputState.error}
                    />

                    <MainTextarea
                        id={'dayDescription'}
                        value={dayDescription.inputState.value}
                        onChange={dayDescription.setValue}
                        label={'Описание'}
                        placeholder={`Опционально: комментарий ко дню`}
                        error={dayDescription.inputState.error}
                        rows={4}
                    />

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Добавить' : 'Добавление...'}
                        disabled={isSubmitting}
                    />
                </form>
            </div>
        </BlockPageContext>
    )
}