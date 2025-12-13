'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useMemo, useState} from "react";
import {GoalPriority} from "@/types/goalTypes";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import MainTextarea from "@/components/inputs/MainTextarea";
import {baseUrlForBackend} from "@/lib";
import {validateGoalDescription, validateGoalName, validateGoalPriority} from "@/lib/utils/validators";
import type {BackendApiResponse} from "@/types/indexTypes";

export default function AddGoal() {

    const goalName = useInputField('');
    const goalDescription = useInputField('');
    const [goalPriority, setGoalPriority] = useState<GoalPriority>('Средний');

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils()

    const goalPriorityOptions: GoalPriority[] = useMemo(() => ['Низкий', 'Средний', 'Высокий'], []) ;

    const validateForm = (): boolean => {
        const goalNameError = validateGoalName(goalName.inputState.value);
        goalName.setError(goalNameError);

        const goalDescriptionError = validateGoalDescription(goalDescription.inputState.value);
        goalDescription.setError(goalDescriptionError);

        const goalPriorityError = validateGoalPriority(goalPriority);

        return !(goalDescriptionError || goalNameError || goalPriorityError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/goal/add-new-goal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: goalName.inputState.value,
                    description: goalDescription.inputState.value,
                    priority: goalPriority,
                }),
            });

            if (result.ok) {
                router.push("/goals");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка добавление цели. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Add goal error:", error);
            setIsSubmitting(false);
        }
    }

    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl pb-2 font-semibold text-center text-gray-900">
                        Добавить цель
                    </h2>
                    <p className="text-center text-gray-600">
                        Добавьте цель в свой список и стремитесь ее выполнить
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-6" onSubmit={handleSubmit}>

                    <MainInput
                        id={'goalName'}
                        value={goalName.inputState.value}
                        onChange={goalName.setValue}
                        label={'Название цели'}
                        placeholder={'Пожать 100кг'}
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

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? 'Добавить' : 'Добавляем...'}
                        disabled={isSubmitting}
                        className={'mt-8'}
                    />
                </form>
            </div>
        </BlockPageContext>
    )
}