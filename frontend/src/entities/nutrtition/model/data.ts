import {useQuery} from "@tanstack/react-query";
import {getDayList} from "@/entities/nutrtition/model/controller";
import {NutritionDay} from "@/entities/nutrtition/model/type";

export function useNutrition(token: string) {

    const { data, isLoading, error, isError, refetch, isFetching } = useQuery<NutritionDay[]>({
        queryKey: ['nutrition', token],
        queryFn: async () => {
            const data = await getDayList(token);

            if (!data) throw new Error('Не удалось загрузить список питания');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { data, isLoading, error, isError, refetch, isFetching }
}