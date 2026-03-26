import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTraining, deleteTraining, updateTraining} from "@/entities/training/model/controller";

export function useCreateTrainingMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTraining,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['training']}),
    });
}

export function useUpdateTrainingMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTraining,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['training']}),
    });
}

export function useDeleteTrainingMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTraining,
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['training']}),
    });
}