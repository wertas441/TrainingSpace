import {useQuery} from "@tanstack/react-query";
import {getDayList} from "@/lib/controllers/nutrition";
import {NutritionDay} from "@/types/nutrition";

export function useNutrition(token: string) {

    const { data: days, isLoading, error, isError, refetch, isFetching } = useQuery<NutritionDay[]>({
        queryKey: ['nutrition'],
        queryFn: async () => {
            const data = await getDayList(token);

            if (!data) throw new Error('Не удалось загрузить список питания');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { days, isLoading, error, isError, refetch, isFetching }
}