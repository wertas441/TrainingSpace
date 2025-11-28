'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {
    validateCalories,
    validateCarbGrams, validateDayDate, validateDayDescription,
    validateDayName,
    validateFatGrams,
    validateProteinGrams
} from "@/lib/utils/validators";
import {FormEvent, useCallback} from "react";
import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {NutritionDay} from "@/types/nutritionTypes";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import ModalWindow from "@/components/UI/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import {deleteDay} from "@/lib/controllers/nutritionController";

interface ChangeNutritionProps {
    dayInfo: NutritionDay,
    token: string | undefined,
}

export default function ChangeNutrition({dayInfo, token}: ChangeNutritionProps){

    const dayName = useInputField(dayInfo.name);
    const dayDescription = useInputField(dayInfo.description);
    const calories = useInputField(String(dayInfo.calories));
    const protein = useInputField(String(dayInfo.protein));
    const fat = useInputField(String(dayInfo.fat));
    const carb = useInputField(String(dayInfo.carb));
    const dayDate = useInputField(String(dayInfo.date));

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

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
            const result = await fetch(`${baseUrlForBackend}/api/nutrition/update-my-day`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id: dayInfo.id,
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
                router.replace("/nutrition");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка изменения дня. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("change nutrition day error:", error);
            setIsSubmitting(false);
        }
    }

    const deleteDayBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteDay(token, dayInfo.id);
            router.replace("/nutrition");
        } catch (error) {
            console.error("delete day error:", error);
            setServerError("Не удалось удалить день. Попробуйте ещё раз позже.");
        }
    }, [dayInfo.id, router, setServerError, token])

    return (
        <>
            <BlockPageContext>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Изменение дня
                    </h2>

                    <ServerError message={serverError} />

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <MainInput
                            id={'dayName'}
                            value={dayName.inputState.value}
                            onChange={dayName.setValue}
                            label={'Имя дня'}
                            error={dayName.inputState.error || undefined}
                        />

                        <MainInput
                            id={'calories'}
                            value={calories.inputState.value}
                            onChange={calories.setValue}
                            label={'Калории (ккал)'}
                            error={calories.inputState.error || undefined}
                        />

                        <MainInput
                            id={'protein'}
                            value={protein.inputState.value}
                            onChange={protein.setValue}
                            label={'Белки (г)'}
                            error={protein.inputState.error || undefined}
                        />

                        <MainInput
                            id={'fat'}
                            value={fat.inputState.value}
                            onChange={fat.setValue}
                            label={'Жиры (г)'}
                            error={fat.inputState.error || undefined}
                        />

                        <MainInput
                            id={'carb'}
                            value={carb.inputState.value}
                            onChange={carb.setValue}
                            label={'Углеводы (г)'}
                            error={carb.inputState.error || undefined}
                        />

                        <MainInput
                            id={'dayDate'}
                            type={'date'}
                            value={dayDate.inputState.value}
                            onChange={dayDate.setValue}
                            label={'Дата'}
                            error={dayDate.inputState.error || undefined}
                        />

                        <MainTextarea
                            id={'dayDescription'}
                            value={dayDescription.inputState.value}
                            onChange={dayDescription.setValue}
                            label={'Описание'}
                            placeholder={`Опционально: комментарий ко дню`}
                            error={dayDescription.inputState.error || undefined}
                            rows={4}
                        />

                        <div className="mt-8 flex items-center gap-x-8">
                            <LightGreenSubmitBtn
                                label={!isSubmitting ? 'Изменить' : 'Процесс...'}
                                disabled={isSubmitting}
                            />
                            <RedGlassBtn
                                label = {'Удалить день'}
                                onClick = {toggleModalWindow}
                            />
                        </div>
                    </form>
                </div>
            </BlockPageContext>

            <ModalWindow
                isExiting = {isExiting}
                modalRef = {windowModalRef}
                windowLabel = {'Подтверждение удаления'}
                windowText = {`Вы действительно хотите удалить день ${dayInfo.name}? Это действие необратимо.`}
                error = {serverError}
                cancelButtonLabel = {'Отмена'}
                cancelFunction = {toggleModalWindow}
                confirmButtonLabel = {'Удалить'}
                confirmFunction = {deleteDayBtn}
                isProcess = {isProcess}
                isRendered = {isRendered}
            />
        </>
    )
}