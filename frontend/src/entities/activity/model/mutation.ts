import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createActivity, deleteActivity, updateActivity} from "@/entities/activity/model/controller";

export function useCreateActivityMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createActivity,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['activity']}),
    });
}

export function useUpdateActivityMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateActivity,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['activity']}),
    });
}

export function useDeleteActivityMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteActivity,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['activity']}),
    });
}
