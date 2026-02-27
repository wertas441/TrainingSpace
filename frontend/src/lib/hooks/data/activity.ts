import {useQuery} from "@tanstack/react-query";
import {getActivityList} from "@/lib/controllers/activity";
import {ActivityDataStructure} from "@/types/activity";

export function useActivity(token: string) {

    const { data: activity, isLoading, error, isError, refetch, isFetching } = useQuery<ActivityDataStructure[]>({
        queryKey: ['activity'],
        queryFn: async () => {
            const data = await getActivityList(token);

            if (!data) throw new Error('Не удалось загрузить список активностей');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { activity, isLoading, error, isError, refetch, isFetching }
}