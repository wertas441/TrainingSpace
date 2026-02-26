import {useQuery} from "@tanstack/react-query";
import {getExercisesList} from "@/lib";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniques";

export function useExerciseList() {

    const { data: exercises, isLoading, error, isError, refetch, isFetching } = useQuery<ExerciseTechniqueItem[]>({
        queryKey: ['exercises'],
        queryFn: async () => {
            const data = await getExercisesList();

            if (!data) throw new Error('Не удалось загрузить список упражнений');

            return data;
        },
        staleTime: 60000 * 10,
    })

    return { exercises, isLoading, error, isError, refetch, isFetching }
}