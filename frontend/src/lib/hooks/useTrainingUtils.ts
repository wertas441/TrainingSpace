import {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import {OptionType} from "@/components/inputs/MainMultiSelect";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

interface UseTrainingUtilsProps {
    exercises: ExerciseTechniqueItem[];
    setExercisesError: Dispatch<SetStateAction<string | null>>;
    initialSelectedExerciseIds?: number[];
}

export function useTrainingUtils({exercises, setExercisesError, initialSelectedExerciseIds}:UseTrainingUtilsProps) {

    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(() => initialSelectedExerciseIds ?? []);
    const [partOfBodyFilter, setPartOfBodyFilter] = useState<string[]>([]);
    const [searchName, setSearchName] = useState<string>('');
    
    const muscleOptions = useMemo(() => {
        const set = new Set<string>();
        exercises.forEach(e => e.partOfTheBody.forEach(p => set.add(p)));
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .map(v => ({ value: v, label: v }));
    }, [exercises]);

    const selectedMuscles: OptionType[] = useMemo(
        () => muscleOptions.filter(o => partOfBodyFilter.includes(o.value)),
        [partOfBodyFilter, muscleOptions]
    );

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        const base = exercises.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesPart =
                partOfBodyFilter.length === 0 ||
                e.partOfTheBody.some(p => partOfBodyFilter.includes(p));
            return matchesName && matchesPart;
        });

        // Сначала уже добавленные в тренировку (selected), затем остальные
        return base.sort((a, b) => {
            const aSelected = selectedExerciseIds.includes(a.id);
            const bSelected = selectedExerciseIds.includes(b.id);

            if (aSelected === bSelected) {
                return 0;
            }

            return aSelected ? -1 : 1;
        });
    }, [searchName, exercises, partOfBodyFilter, selectedExerciseIds]);

    const handleToggleExercise = useCallback((id: number) => {
        setSelectedExerciseIds(prev => {
            if (prev.includes(id)) {
                const next = prev.filter(x => x !== id);
                if (next.length > 0) setExercisesError(null);
                return next;
            }
            const next = [...prev, id];
            if (next.length > 0) setExercisesError(null);
            return next;
        })
    }, [setExercisesError]);
    
    return {
        partOfBodyFilter,
        setPartOfBodyFilter,
        searchName,
        setSearchName,
        muscleOptions,
        selectedMuscles,
        filteredList,
        handleToggleExercise,
        selectedExerciseIds,
        setSelectedExerciseIds
    };
    
}