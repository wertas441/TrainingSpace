'use client'

import {GoalFormValues, GoalPriority} from "@/types/goalTypes";
import BlockPageContext from "@/components/UI/UiContex/BlockPageContext";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import MainTextarea from "@/components/inputs/MainTextarea";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import {
    validateGoalDescription,
    validateGoalName,
} from "@/lib/utils/validators";
import type {BackendApiResponse} from "@/types/indexTypes";
import {Controller, useForm} from "react-hook-form";

const goalPriorityOptions: GoalPriority[] = ['Низкий', 'Средний', 'Высокий'] as const;

export default function AddGoal() {

    const {register, handleSubmit, control, formState: { errors }} = useForm<GoalFormValues>({
        defaultValues: {
            goalName: '',
            goalDescription: '',
            goalPriority: 'Средний',
        }
    })

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils()

    const onSubmit = async (values: GoalFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            requestData: {
                name: values.goalName,
                description: values.goalDescription,
                priority: values.goalPriority,
            }
        }

        try {
            await api.post<BackendApiResponse>('/goal/add-new-goal', payload)

            router.push("/goals");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('add goal error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <BlockPageContext>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl pb-2 font-semibold text-center text-gray-900 dark:text-white">
                        Добавить цель
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300">
                        Добавьте цель в свой список и стремитесь ее выполнить
                    </p>
                </div>

                <ServerError message={serverError} />

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                    <MainInput
                        id={'goalName'}
                        label={'Название цели'}
                        placeholder={'Пожать 100кг'}
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