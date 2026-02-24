'use client'

import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {
    validateCalories,
    validateCarbGrams,
    validateDayDate,
    validateDayDescription,
    validateDayName,
    validateFatGrams,
    validateProteinGrams
} from "@/lib/utils/validators/nutrition";
import {useCallback} from "react";
import {serverApi, getServerErrorMessage, showErrorMessage} from "@/lib";
import type {BackendApiResponse} from "@/types";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {NutritionDay, NutritionFormValues} from "@/types/nutrition";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import {deleteDay} from "@/lib/controllers/nutrition";
import {useForm} from "react-hook-form";

interface IProps {
    dayInfo: NutritionDay,
    token: string,
}

export default function ChangeNutrition({dayInfo, token}: IProps){

    const {register, handleSubmit, formState: { errors }} = useForm<NutritionFormValues>({
        defaultValues: {
            dayName: dayInfo.name,
            dayDescription: dayInfo.description,
            calories: String(dayInfo.calories),
            protein: String(dayInfo.protein),
            fat: String(dayInfo.fat),
            carb: String(dayInfo.carb),
            dayDate: String(dayInfo.date),
        }
    })

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const { isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef } = useModalWindow()

    const onSubmit = async (values: NutritionFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            publicId: dayInfo.publicId,
            name: values.dayName,
            description: values.dayDescription,
            date: values.dayDate,
            calories: parseInt(values.calories, 10),
            protein: parseInt(values.protein, 10),
            fat: parseInt(values.fat, 10),
            carb: parseInt(values.carb, 10),
        }

        try {
            await serverApi.put<BackendApiResponse>('/nutrition/day', payload)

            router.replace("/nutrition");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('change nutrition day error:', err);

            setIsSubmitting(false);
        }
    }

    const deleteDayBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteDay(token, dayInfo.publicId);
            router.replace("/nutrition");
        } catch (error) {
            console.error("delete day error:", error);
            setServerError("Не удалось удалить день. Попробуйте ещё раз позже.");
        }
    }, [dayInfo.publicId, router, setServerError, token])

    return (
        <>
            <BlockPageContext>
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                        Изменение дня
                    </h2>

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
                isExiting={isExiting}
                modalRef={windowModalRef}
                windowLabel={'Подтверждение удаления'}
                windowText={`Вы действительно хотите удалить день ${dayInfo.name}? Это действие необратимо.`}
                error={serverError}
                cancelButtonLabel={'Отмена'}
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteDayBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}