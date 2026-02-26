import {useQuery} from "@tanstack/react-query";
import {TrainingListResponse} from "@/types/training";
import {getTrainingList} from "@/lib/controllers/training";

export function useTrainings(token: string) {

    const { data: trainings, isLoading, error, isError, refetch, isFetching } = useQuery<TrainingListResponse[]>({
        queryKey: ['training'],
        queryFn: async () => {
            const data = await getTrainingList(token);

            if (!data) throw new Error('Не удалось загрузить список тренировок');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { trainings, isLoading, error, isError, refetch, isFetching }
}