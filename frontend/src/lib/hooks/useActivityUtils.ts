import { ExerciseSetsByExerciseId } from "@/types/activityTypes";
import {TrainingDataStructure} from "@/types/indexTypes";
import {getTrainingExercises} from "@/lib/controllers/activityController";
import {useMemo, useState} from "react";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {OptionType} from "@/components/inputs/MainMultiSelect";
import {UseInputFieldReturn} from "@/lib/hooks/useInputField";

interface UseTrainingListProps {
    myTrainings: TrainingDataStructure[];
    trainingId: UseInputFieldReturn;
}

export function useActivityUtils({myTrainings, trainingId}: UseTrainingListProps){

    const [exerciseSets, setExerciseSets] = useState<ExerciseSetsByExerciseId>({});
    const [trainingExercises, setTrainingExercises] = useState<ExerciseTechniqueItem[]>([]);

    const trainingOptions: OptionType[] = useMemo(
        () => myTrainings.map(t => ({ value: String(t.id), label: t.name })),
        [myTrainings]
    );

    const selectedTrainingOption: OptionType[] = useMemo(() => {
        const found = trainingOptions.find(o => o.value === trainingId.inputState.value);
        return found ? [found] : [];
    }, [trainingOptions, trainingId.inputState.value]);

    const selectedTraining = useMemo(
        () => trainingId.inputState.value ? myTrainings.find(t => t.id === Number(trainingId.inputState.value)) : undefined,
        [trainingId.inputState.value, myTrainings]
    );

    const initSetsForTraining = (training?: TrainingDataStructure) => {
        if (!training) {
            setExerciseSets({});
            return;
        }
        const next: ExerciseSetsByExerciseId = {};
        training.exercises.forEach(exId => {
            next[exId] = [{ id: 1, weight: 0, quantity: 0 }];
        });
        setExerciseSets(next);
    };

    const handleChangeTraining = (val: string) => {
        trainingId.setValue(val);
        const found = val ? myTrainings.find(t => t.id === Number(val)) : undefined;
        initSetsForTraining(found);
        if (found) {
            getTrainingExercises(found.id)
                .then(setTrainingExercises)
                .catch((err) => {
                    console.error('Ошибка загрузки упражнений тренировки:', err);
                    setTrainingExercises([]);
                });
        } else {
            setTrainingExercises([]);
        }
    };

    return {
        exerciseSets,
        setExerciseSets,
        trainingExercises,
        setTrainingExercises,
        trainingOptions,
        selectedTrainingOption,
        selectedTraining,
        initSetsForTraining,
        handleChangeTraining
    }
}

