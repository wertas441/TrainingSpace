'use client'

import {usePageUtils} from "@/shared/hooks/usePageUtils";
import {
    validateCalories,
    validateCarbGrams,
    validateDayDate,
    validateDayDescription,
    validateDayName,
    validateFatGrams,
    validateProteinGrams
} from "@/entities/nutrtition/model/validation";
import {useCallback} from "react";
import {showErrorMessage} from "@/shared";
import BlockPageContext from "@/widgets/UiContex/BlockPageContext";
import ServerError from "@/shared/UI-kit/errors/ServerError";
import MainInput from "@/shared/UI-kit/inputs/MainInput";
import MainTextarea from "@/shared/UI-kit/inputs/MainTextarea";
import {NutritionDay, NutritionForm} from "@/entities/nutrtition/model/type";
import {useModalWindow} from "@/shared/hooks/useModalWindow";
import {useForm} from "react-hook-form";
import {useDeleteDayMutation, useUpdateDayMutation} from "@/entities/nutrtition/model/mutation";
import RedGlassBtn from "@/shared/UI-kit/buttons/RedGlassBtn";
import LightGreenBtn from "@/shared/UI-kit/buttons/LightGreenBtn";
import ModalWindow from "@/widgets/ModalWindow";

interface IProps {
    dayInfo: NutritionDay,
    token: string,
}

export default function ChangeNutrition({dayInfo, token}: IProps){

    const { register, handleSubmit, formState: { errors } } = useForm<NutritionForm>({
        defaultValues: {
            name: dayInfo.name,
            description: dayInfo.description,
            calories: String(dayInfo.calories),
            protein: String(dayInfo.protein),
            fat: String(dayInfo.fat),
            carb: String(dayInfo.carb),
            dayDate: String(dayInfo.date),
        }
    })

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();
    const { isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef } = useModalWindow();

    const updateDayMutation = useUpdateDayMutation();
    const deleteDayMutation = useDeleteDayMutation();

    const onSubmit = async (values: NutritionForm)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            publicId: dayInfo.publicId,
            name: values.name,
            description: values.description,
            date: values.dayDate,
            calories: parseInt(values.calories, 10),
            protein: parseInt(values.protein, 10),
            fat: parseInt(values.fat, 10),
            carb: parseInt(values.carb, 10),
        }

        updateDayMutation.mutate(payload, {
            onSuccess: () => router.replace("/nutrition"),

            onError: (err: unknown) => {
                const message = err instanceof Error ? err.message : "Не удалось изменить день. Попробуйте ещё раз.";

                setServerError(message);
                if (showErrorMessage) console.error('change day error:', err);
            },
        });
    }

    const deleteDayBtn = useCallback(async () => {
        setServerError(null);

        const payload = {
            tokenValue: token,
            dayId: dayInfo.publicId,
        }

        deleteDayMutation.mutate(payload, {
            onSuccess: () => router.replace("/nutrition"),

            onError: (err: unknown) => {
                console.error("delete day error:", err);

                setServerError("Не удалось удалить день. Попробуйте ещё раз позже.");
            },
        });
    }, [setServerError, token, dayInfo.publicId, deleteDayMutation, router])

    return (
        <>
            <BlockPageContext>
                <div className="relative z-10 space-y-6">
                    <h1 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Изменить день питания
                    </h1>

                    <ServerError message={serverError} />

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <MainInput
                            id={'name'}
                            label={'Наименование дня'}
                            placeholder={'Например: День с упором на белок'}
                            error={errors.name?.message}
                            {...register('name', {validate: (value) => validateDayName(value) || true})}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <MainInput
                                id={'calories'}
                                label={'Калории (ккал)'}
                                error={errors.calories?.message}
                                {...register('calories', {validate: (value) => validateCalories(value) || true})}
                            />

                            <MainInput
                                id={'dayDate'}
                                type={'date'}
                                label={'Дата'}
                                error={errors.dayDate?.message}
                                {...register('dayDate', {validate: (value) => validateDayDate(value) || true})}
                            />
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-800/70">
                            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Макроэлементы
                            </p>
                            <div className="grid gap-4 sm:grid-cols-3">
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
                            </div>
                        </div>

                        <MainTextarea
                            id={'description'}
                            label={'Описание'}
                            placeholder={`Опционально: комментарий ко дню`}
                            error={errors.description?.message}
                            {...register('description', {validate: (value) => validateDayDescription(value) || true})}
                        />

                        <div className="mt-8 md:flex flex-row space-y-4 md:space-y-0  items-center gap-x-8">
                            <LightGreenBtn
                                type={`submit`}
                                label={!isSubmitting ? 'Изменить' : 'Изменение...'}
                                disabled={isSubmitting}
                            />

                            <RedGlassBtn
                                label={'Удалить день'}
                                onClick={toggleModalWindow}
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
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteDayBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}