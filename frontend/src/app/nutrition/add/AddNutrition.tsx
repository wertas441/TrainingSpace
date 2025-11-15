'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import {MainInput} from "@/components/inputs/MainInput";
import {FormEvent, useMemo} from "react";
import {
    BeakerIcon,
    CalendarIcon,
    FireIcon,
    RocketLaunchIcon,
    ScaleIcon,
    TagIcon
} from "@heroicons/react/24/outline";
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
            const result = await fetch(`${baseUrlForBackend}/api/nutrition/add-day`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    dayName: dayName.inputState.value,
                    dayDescription: dayDescription.inputState.value,
                    dayDate: dayDate.inputState.value,
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

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setServerError(result.message || "Не удалось добавить день. Проверьте корректность данных.");
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Проверьте интернет-соединение или попробуйте позже.");
            console.error("Add nutrition day error:", error);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl pb-2 font-bold text-center text-gray-900">
                        Добавить день питания
                    </h2>
                    <p className="text-center text-gray-600">
                        Заполните данные для отслеживания
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-6" onSubmit={handleSubmit}>

                    <MainInput
                        id={'dayName'}
                        value={dayName.inputState.value}
                        onChange={dayName.setValue}
                        icon={useMemo(() => <TagIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Имя дня'}
                        error={dayName.inputState.error || undefined}
                    />

                    <MainInput
                        id={'calories'}
                        value={calories.inputState.value}
                        onChange={calories.setValue}
                        icon={useMemo(() => <FireIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Калории (ккал)'}
                        error={calories.inputState.error || undefined}
                    />

                    <MainInput
                        id={'protein'}
                        value={protein.inputState.value}
                        onChange={protein.setValue}
                        icon={useMemo(() => <BeakerIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Белки (г)'}
                        error={protein.inputState.error || undefined}
                    />

                    <MainInput
                        id={'fat'}
                        value={fat.inputState.value}
                        onChange={fat.setValue}
                        icon={useMemo(() => <ScaleIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Жиры (г)'}
                        error={fat.inputState.error || undefined}
                    />

                    <MainInput
                        id={'carb'}
                        value={carb.inputState.value}
                        onChange={carb.setValue}
                        icon={useMemo(() => <RocketLaunchIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Углеводы (г)'}
                        error={carb.inputState.error || undefined}
                    />

                    <MainInput
                        id={'dayDate'}
                        type={'date'}
                        value={dayDate.inputState.value}
                        onChange={dayDate.setValue}
                        icon={useMemo(() => <CalendarIcon className="h-5 w-5 text-gray-500" />, [])}
                        placeholder={'Дата дня'}
                        error={dayDate.inputState.error || undefined}
                    />

                    <MainTextarea
                        id={'dayDescription'}
                        value={dayDescription.inputState.value}
                        onChange={dayDescription.setValue}
                        placeholder={'Описание дня (необязательно)'}
                        error={dayDescription.inputState.error || undefined}
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