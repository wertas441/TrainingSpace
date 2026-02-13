'use client'

import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import {
    validateCalories,
    validateCarbGrams,
    validateDayDate,
    validateDayName,
    validateFatGrams,
    validateProteinGrams,
    validateDayDescription,
} from "@/lib/utils/validators/nutrition";
import MainTextarea from "@/components/inputs/MainTextarea";
import MainInput from "@/components/inputs/MainInput";
import type {BackendApiResponse} from "@/types";
import {useForm} from "react-hook-form";
import {NutritionFormValues} from "@/types/nutrition";

export default function AddNutrition(){

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const {register, handleSubmit, formState: { errors }} = useForm<NutritionFormValues>({
        defaultValues: {
            dayDate: initialDate,
        }
    })

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const onSubmit = async (values: NutritionFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            name: values.dayName,
            description: values.dayDescription,
            date: values.dayDate,
            calories: parseInt(values.calories, 10),
            protein: parseInt(values.protein, 10),
            fat: parseInt(values.fat, 10),
            carb: parseInt(values.carb, 10),
        }

        try {
            await api.post<BackendApiResponse>('/nutrition/day', payload)

            router.push("/nutrition");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('add new nutrition day error:', err);

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

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                    <MainInput
                        id={'dayName'}
                        label={'Наименование дня'}
                        error={errors.dayName?.message}
                        {...register('dayName', {validate: (value) => validateDayName(value) || true})}
                    />

                    <MainInput
                        id={'calories'}
                        label={'Калории (ккал)'}
                        error={errors.calories?.message}
                        {...register('calories', {validate: (value) => validateCalories(value) || true})}
                    />

                    <MainInput
                        id={'protein'}
                        label={'Белки (г)'}
                        error={errors.protein?.message}
                        {...register('protein', {validate: (value) => validateProteinGrams(value) || true})}
                    />

                    <MainInput
                        id={'fat'}
                        label={'Жиры (г)'}
                        error={errors.fat?.message}
                        {...register('fat', {validate: (value) => validateFatGrams(value) || true})}
                    />

                    <MainInput
                        id={'carb'}
                        label={'Углеводы (г)'}
                        error={errors.carb?.message}
                        {...register('carb', {validate: (value) => validateCarbGrams(value) || true})}
                    />

                    <MainInput
                        id={'dayDate'}
                        type={'date'}
                        label={'Дата'}
                        error={errors.dayDate?.message}
                        {...register('dayDate', {validate: (value) => validateDayDate(value) || true})}
                    />

                    <MainTextarea
                        id={'dayDescription'}
                        label={'Описание'}
                        placeholder={`Опционально: комментарий ко дню`}
                        error={errors.dayDescription?.message}
                        {...register('dayDescription', {validate: (value) => validateDayDescription(value) || true})}
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