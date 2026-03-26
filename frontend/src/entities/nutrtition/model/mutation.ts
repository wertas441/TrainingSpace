import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createDay, deleteDay, updateDay} from "@/entities/nutrtition/model/controller";
import {deleteGoal} from "@/entities/goal/model/controller";

export function useCreateDayMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDay,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['nutrition']}),
    });
}

export function useUpdateDayMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDay,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['nutrition']}),
    });
}

export function useDeleteDayMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDay,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['nutrition']}),
    });
}
