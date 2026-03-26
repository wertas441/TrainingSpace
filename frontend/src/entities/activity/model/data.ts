import {useQuery} from "@tanstack/react-query";
import {getActivityList} from "@/entities/activity/model/controller";
import {ActivityDataStructure} from "@/entities/activity/model/type";

export function useActivity(token: string) {

    const { data, isLoading, error, isError, refetch, isFetching } = useQuery<ActivityDataStructure[]>({
        queryKey: ['activity', token],
        queryFn: async () => {
            const data = await getActivityList(token);

            if (!data) throw new Error('Не удалось загрузить список активностей');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { data, isLoading, error, isError, refetch, isFetching }
}