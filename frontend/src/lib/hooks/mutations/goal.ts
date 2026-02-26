import {useMutation, useQueryClient} from "@tanstack/react-query";
import {completeGoal, createGoal} from "@/lib/controllers/goal";

export function useCreateGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGoal,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['goals']});
        },
    });
}

export function useCompleteGoalMutation(token: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (goalId: string) => completeGoal(token, goalId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ['goals']}),
                queryClient.invalidateQueries({queryKey: ['completedGoals']}),
            ]);
        },
    });
}
