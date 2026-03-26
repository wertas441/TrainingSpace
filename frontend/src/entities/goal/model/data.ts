import {useQuery} from "@tanstack/react-query";
import {getCompleteGoalList, getGoalList} from "@/entities/goal/model/controller";
import {CompleteGoalsStructure, GoalsStructure} from "@/entities/goal/model/type";

export function useGoals(token: string) {

    const { data, isLoading, error, isError, refetch, isFetching } = useQuery<GoalsStructure[]>({
        queryKey: ['goals', token],

        queryFn: async () => {
            const data = await getGoalList(token);

            if (!data) throw new Error('Не удалось загрузить список целей');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { data, isLoading, error, isError, refetch, isFetching }
}

export function useCompletedGoals(token: string) {

    const { data, isLoading, error, isError, refetch, isFetching } = useQuery<CompleteGoalsStructure[]>({
        queryKey: ['completedGoals', token],

        queryFn: async () => {
            const data = await getCompleteGoalList(token);

            if (!data) throw new Error('Не удалось загрузить список выполненных целей');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { data, isLoading, error, isError, refetch, isFetching }
}