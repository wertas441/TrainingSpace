'use client'

import {useCallback} from "react";
import {GoalForm, GoalPriority, GoalsStructure} from "@/entities/goal/model/type";
import {usePageUtils} from "@/shared/hooks/usePageUtils";
import {validateGoalDescription, validateGoalName} from "@/entities/goal/model/validation";
import {showErrorMessage} from "@/shared";
import BlockPageContext from "@/widgets/UiContex/BlockPageContext";
import ServerError from "@/shared/UI-kit/errors/ServerError";
import MainInput from "@/shared/UI-kit/inputs/MainInput";
import MainTextarea from "@/shared/UI-kit/inputs/MainTextarea";
import ChipRadioGroup from "@/shared/UI-kit/inputs/ChipRadioGroup";
import RedGlassBtn from "@/shared/UI-kit/buttons/RedGlassBtn";
import {useModalWindow} from "@/shared/hooks/useModalWindow";
import {Controller, useForm} from "react-hook-form";
import {useDeleteGoalMutation, useUpdateGoalMutation} from "@/entities/goal/model/mutation";
import LightGreenBtn from "@/shared/UI-kit/buttons/LightGreenBtn";
import ModalWindow from "@/widgets/ModalWindow";

interface IProps {
    goalInfo: GoalsStructure;
    token: string;
}

const goalPriorityOptions: GoalPriority[] = ['Низкий', 'Средний', 'Высокий'] as const;

export default function ChangeGoal({goalInfo, token}: IProps) {

    const { register, handleSubmit, control, formState: { errors } } = useForm<GoalForm>({
        defaultValues: {
            name: goalInfo.name,
            description: goalInfo.description,
            priority: goalInfo.priority,
        }
    })

    const { serverError, setServerError, isSubmitting, router } = usePageUtils()

    const { isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef } = useModalWindow()

    const updateGoalMutation = useUpdateGoalMutation();
    const deleteGoalMutation = useDeleteGoalMutation();

    const onSubmit = (values: GoalForm)=> {
        setServerError(null);

        const payload = {
            goalId: goalInfo.publicId,
            name: values.name,
            description: values.description,
            priority: values.priority,
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
                            id={'name'}
                            label={'Название цели'}
                            placeholder={'Например: Пожать 100кг'}
                            error={errors.name?.message}
                            {...register('name', {validate: (value) => validateGoalName(value) || true})}
                        />

                        <MainTextarea
                            id="description"
                            label="Описание"
                            placeholder="Опционально: описание для цели"
                            error={errors.description?.message}
                            {...register('description', {validate: (value) => validateGoalDescription(value) || true})}
                        />

                        <Controller
                            control={control}
                            name="priority"
                            render={({field}) => (
                                <ChipRadioGroup<GoalPriority>
                                    id="priority"
                                    label={`Приоритет цели`}
                                    choices={goalPriorityOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <div className="mt-8 md:flex flex-row space-y-4 md:space-y-0  items-center gap-x-8">
                            <LightGreenBtn
                                label={!updateGoalMutation.isPending ? 'Изменить' : 'Процесс...'}
                                type={`submit`}
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
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteGoalBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}