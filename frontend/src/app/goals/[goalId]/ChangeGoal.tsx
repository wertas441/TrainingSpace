'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useCallback, useMemo, useState} from "react";
import {GoalPriority, GoalsStructure} from "@/types/goalTypes";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {validateGoalDescription, validateGoalName, validateGoalPriority} from "@/lib/utils/validators";
import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import {deleteGoal} from "@/lib/controllers/goalController";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import ModalWindow from "@/components/UI/ModalWindow";

interface ChangeGoalProps {
    goalInfo: GoalsStructure;
    token: string;
}

export function ChangeGoal({goalInfo, token}: ChangeGoalProps) {

    const goalName = useInputField(goalInfo.name);
    const goalDescription = useInputField(goalInfo.description);
    const [goalPriority, setGoalPriority] = useState<GoalPriority>(goalInfo.priority);

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils()

    const goalPriorityOptions: GoalPriority[] = useMemo(() => ['Низкий', 'Средний', 'Высокий'], []);

    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

    const validateForm = (): boolean => {
        const goalNameError = validateGoalName(goalName.inputState.value);
        goalName.setError(goalNameError);

        const goalDescriptionError = validateGoalDescription(goalDescription.inputState.value);
        goalDescription.setError(goalDescriptionError);

        const goalPriorityError = validateGoalPriority(goalPriority);

        return !(goalDescriptionError || goalNameError || goalPriorityError);
    }

    const handleSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/goal/update-my-goal`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    goalId: goalInfo.id,
                    name: goalName.inputState.value,
                    description: goalDescription.inputState.value,
                    priority: goalPriority,
                }),
            });

            if (result.ok) {
                router.replace("/goals");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка изменения цели. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("change goal error:", error);
            setIsSubmitting(false);
        }
    }

    const deleteGoalBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteGoal(token, goalInfo.id);
            router.replace("/goals");
        } catch (error) {
            console.error("delete goal error:", error);
            setServerError("Не удалось удалить цель. Попробуйте ещё раз позже.");
        }
    }, [goalInfo.id, router, setServerError, token])

    return (
        <>
            <BlockPageContext>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Изменение цели
                    </h2>

                    <ServerError message={serverError}/>

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <MainInput
                            id={'goalName'}
                            value={goalName.inputState.value}
                            onChange={goalName.setValue}
                            label={'Название цели'}
                            placeholder={'Например: Пожать 100кг'}
                            error={goalName.inputState.error || undefined}
                        />

                        <MainTextarea
                            id="activityDescription"
                            label="Описание"
                            placeholder="Опционально: описание для цели"
                            value={goalDescription.inputState.value}
                            onChange={goalDescription.setValue}
                            error={goalDescription.inputState.error || undefined}
                            rows={4}
                        />

                        <ChipRadioGroup<GoalPriority>
                            id="goal-Priority"
                            name="goalPriority"
                            label={`Приоритет цели`}
                            choices={goalPriorityOptions}
                            value={goalPriority}
                            onChange={setGoalPriority}
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