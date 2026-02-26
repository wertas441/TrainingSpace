import {useQuery} from "@tanstack/react-query";
import {getCompleteGoalList, getGoalList} from "@/lib/controllers/goal";
import {CompleteGoalsStructure, GoalsStructure} from "@/types/goal";

export function useGoals(token: string) {

    const { data: goals, isLoading, error, isError, refetch, isFetching } = useQuery<GoalsStructure[]>({
        queryKey: ['goals', token],

        queryFn: async () => {
            const data = await getGoalList(token);

            if (!data) throw new Error('Не удалось загрузить список целей');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { goals, isLoading, error, isError, refetch, isFetching }
}

export function useCompletedGoals(token: string) {

    const { data: completedGoals, isLoading, error, isError, refetch, isFetching } = useQuery<CompleteGoalsStructure[]>({
        queryKey: ['completedGoals', token],

        queryFn: async () => {
            const data = await getCompleteGoalList(token);

            if (!data) throw new Error('Не удалось загрузить список выполненных целей');

            return data;
        },

        staleTime: 60000 * 10,
    })

    return { completedGoals, isLoading, error, isError, refetch, isFetching }
}