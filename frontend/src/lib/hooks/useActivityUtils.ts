import { ExerciseSetsByExerciseId } from "@/types/activityTypes";
import {TrainingDataStructure} from "@/types/indexTypes";
import {getTrainingExercises} from "@/lib/controllers/activityController";
import {useEffect, useMemo, useState} from "react";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {OptionType} from "@/components/inputs/MainMultiSelect";

interface UseTrainingListProps {
    myTrainings: TrainingDataStructure[];
    trainingId: string;
    onTrainingIdChange?: (val: string) => void;
}

export function useActivityUtils({myTrainings, trainingId, onTrainingIdChange}: UseTrainingListProps){

    const [exerciseSets, setExerciseSets] = useState<ExerciseSetsByExerciseId>({});
    const [trainingExercises, setTrainingExercises] = useState<ExerciseTechniqueItem[]>([]);

    const trainingOptions: OptionType[] = useMemo(
        () => myTrainings.map(t => ({ value: String(t.id), label: t.name })),
        [myTrainings]
    );

    const selectedTrainingOption: OptionType[] = useMemo(() => {
        const found = trainingOptions.find(o => o.value === trainingId);
        return found ? [found] : [];
    }, [trainingOptions, trainingId]);

    const selectedTraining = useMemo(
        () => trainingId ? myTrainings.find(t => t.id === Number(trainingId)) : undefined,
        [trainingId, myTrainings]
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
        onTrainingIdChange?.(val);
    };

    useEffect(() => {
        const found = trainingId ? myTrainings.find(t => t.id === Number(trainingId)) : undefined;

        initSetsForTraining(found);

        if (!found) {
            setTrainingExercises([]);
            return;
        }

        getTrainingExercises(found.id)
            .then(setTrainingExercises)
            .catch((err) => {
                console.error('Ошибка загрузки упражнений тренировки:', err);
                setTrainingExercises([]);
            });
    }, [trainingId, myTrainings]);

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

