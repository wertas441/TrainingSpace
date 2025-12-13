import {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import {OptionType} from "@/components/inputs/MainMultiSelect";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

interface UseTrainingUtilsProps {
    exercises: ExerciseTechniqueItem[];
    setExercisesError: Dispatch<SetStateAction<string | null>>;
}

export function useTrainingUtils({exercises, setExercisesError}:UseTrainingUtilsProps) {

    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
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
        return exercises.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesPart = partOfBodyFilter.length === 0 || e.partOfTheBody.some(p => partOfBodyFilter.includes(p));
            return matchesName && matchesPart;
        });
    }, [searchName, exercises, partOfBodyFilter]);

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