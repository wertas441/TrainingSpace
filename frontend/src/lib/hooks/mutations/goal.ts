import {useMutation, useQueryClient} from "@tanstack/react-query";
import {completeGoal, createGoal, deleteGoal, updateGoal} from "@/lib/controllers/goal";
import {deleteTraining} from "@/lib/controllers/training";

export function useCreateGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGoal,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['goals']}),
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

export function useUpdateGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGoal,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['goals']}),
    });
}

export function useDeleteGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGoal,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['goals']}),
    });
}
