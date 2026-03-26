import {useQuery} from "@tanstack/react-query";
import {TrainingListResponse} from "@/entities/training/model/type";
import {getTrainingList} from "@/entities/training/model/controller";

export function useTrainings(token: string) {

    const { data: trainings, isLoading, error, isError, refetch, isFetching } = useQuery<TrainingListResponse[]>({
        queryKey: ['training', token],
        queryFn: async () => {
            const data = await getTrainingList(token);

            if (!data) throw new Error('Не удалось загрузить список тренировок');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { trainings, isLoading, error, isError, refetch, isFetching }
}