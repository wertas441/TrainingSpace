import {useQuery} from "@tanstack/react-query";
import {getExercisesList} from "@/lib";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniques";

export default function useExerciseList() {

    const { data: exercises, isLoading, error, isError } = useQuery<ExerciseTechniqueItem[] | undefined>({
        queryKey: ['exercises'],
        queryFn: getExercisesList,
        staleTime: 5000
    })

    return { exercises, isLoading, error, isError }
}