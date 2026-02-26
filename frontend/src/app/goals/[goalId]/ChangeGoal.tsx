'use client'

import {useCallback} from "react";
import {GoalFormValues, GoalPriority, GoalsStructure} from "@/types/goal";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateGoalDescription, validateGoalName} from "@/lib/utils/validators/goal";
import {showErrorMessage} from "@/lib";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import {deleteGoal} from "@/lib/controllers/goal";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {Controller, useForm} from "react-hook-form";
import {useDeleteGoalMutation, useUpdateGoalMutation} from "@/lib/hooks/mutations/goal";

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

    const { serverError, setServerError, isSubmitting, router } = usePageUtils()

    const { isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef } = useModalWindow()

    const updateGoalMutation = useUpdateGoalMutation();
    const deleteGoalMutation = useDeleteGoalMutation();

    const onSubmit = (values: GoalFormValues)=> {
        setServerError(null);

        const payload = {
            goalId: goalInfo.publicId,
            name: values.goalName,
            description: values.goalDescription,
            priority: values.goalPriority,
        }

        updateGoalMutation.mutate(payload, {
            onSuccess: () => router.replace("/goals"),

            onError: (err: unknown) => {
                const message = err instanceof Error ? err.message : "Не удалось изменить цель. Попробуйте ещё раз.";

                setServerError(message);
                if (showErrorMessage) console.error('change goal error:', err);
            },
        });
    }

    const deleteGoalBtn = useCallback(async () => {
        setServerError(null);

        const payload = {
            tokenValue: token,
            goalId: goalInfo.publicId,
        }

        deleteGoalMutation.mutate(payload, {
            onSuccess: () => router.replace("/goals"),

            onError: (err: unknown) => {
                console.error("delete goal error:", err);

                setServerError("Не удалось удалить цель. Попробуйте ещё раз позже.");
            },
        });
    }, [deleteGoalMutation, goalInfo.publicId, router, setServerError, token])

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
                                label={!updateGoalMutation.isPending ? 'Изменить' : 'Процесс...'}
                                disabled={isSubmitting || updateGoalMutation.isPending}
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