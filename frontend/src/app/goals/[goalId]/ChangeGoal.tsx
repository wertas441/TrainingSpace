'use client'

import {useCallback} from "react";
import {GoalFormValues, GoalPriority, GoalsStructure} from "@/types/goal";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateGoalDescription, validateGoalName} from "@/lib/utils/validators/goal";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import type {BackendApiResponse} from "@/types";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import {deleteGoal} from "@/lib/controllers/goalController";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {Controller, useForm} from "react-hook-form";

interface IProps {
    goalInfo: GoalsStructure;
    token: string;
}

const goalPriorityOptions: GoalPriority[] = ['Низкий', 'Средний', 'Высокий'] as const;

export function ChangeGoal({goalInfo, token}: IProps) {

    const {register, handleSubmit, control, formState: { errors }} = useForm<GoalFormValues>({
        defaultValues: {
            goalName: goalInfo.name,
            goalDescription: goalInfo.description,
            goalPriority: goalInfo.priority,
        }
    })

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils()
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

    const onSubmit = async (values: GoalFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            goalId: goalInfo.publicId,
            name: values.goalName,
            description: values.goalDescription,
            priority: values.goalPriority,

        }

        try {
            await api.put<BackendApiResponse>('/goal/goal', payload)

            router.replace("/goals");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('change goal error:', err);

            setIsSubmitting(false);
        }
    }

    const deleteGoalBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteGoal(token, goalInfo.publicId);
            router.replace("/goals");
        } catch (error) {
            console.error("delete goal error:", error);
            setServerError("Не удалось удалить цель. Попробуйте ещё раз позже.");
        }
    }, [goalInfo.publicId, router, setServerError, token])

    return (
        <>
            <BlockPageContext>
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                        Изменение цели
                    </h2>

                    <ServerError message={serverError}/>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <MainInput
                            id={'goalName'}
                            label={'Название цели'}
                            placeholder={'Например: Пожать 100кг'}
                            error={errors.goalName?.message}
                            {...register('goalName', {validate: (value) => validateGoalName(value) || true})}
                        />

                        <MainTextarea
                            id="goalDescription"
                            label="Описание"
                            placeholder="Опционально: описание для цели"
                            error={errors.goalDescription?.message}
                            {...register('goalDescription', {validate: (value) => validateGoalDescription(value) || true})}
                        />

                        <Controller
                            control={control}
                            name="goalPriority"
                            render={({field}) => (
                                <ChipRadioGroup<GoalPriority>
                                    id="goalPriority"
                                    label={`Приоритет цели`}
                                    choices={goalPriorityOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <div className="mt-8 md:flex flex-row space-y-4 md:space-y-0  items-center gap-x-8">
                            <LightGreenSubmitBtn
                                label={!isSubmitting ? 'Изменить' : 'Процесс...'}
                                disabled={isSubmitting}
                            />
                            <RedGlassBtn
                                label={'Удалить цель'}
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
                windowText={`Вы действительно хотите удалить цель ${goalInfo.name}? Это действие необратимо.`}
                error={serverError}
                cancelButtonLabel={'Отмена'}
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteGoalBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}