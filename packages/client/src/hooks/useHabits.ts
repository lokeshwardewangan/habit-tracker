import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   habitsApi,
   type CreateHabitPayload,
   type UpdateHabitPayload,
} from "../api/habits.api";
import { completionsApi } from "../api/completions.api";
import { dashboardApi } from "../api/dashboard.api";
import { toast } from "sonner";

export const useHabits = (status: "active" | "archived" | "all" = "active") => {
   return useQuery({
      queryKey: ["habits", status],
      queryFn: () => habitsApi.getHabits(status),
   });
};

export const useHabit = (id: string | undefined) => {
   return useQuery({
      queryKey: ["habit", id],
      queryFn: () => (id ? habitsApi.getHabitById(id) : null),
      enabled: !!id,
   });
};

export const useCreateHabit = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (payload: CreateHabitPayload) =>
         habitsApi.createHabit(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["habits"] });
         queryClient.invalidateQueries({ queryKey: ["stats"] });
         toast.success("New habit created successfully!");
      },
      onError: (err: { message?: string }) => {
         toast.error(err.message || "Failed to create habit");
      },
   });
};

export const useUpdateHabit = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({
         id,
         payload,
      }: {
         id: string;
         payload: UpdateHabitPayload;
      }) => habitsApi.updateHabit(id, payload),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["habits"] });
         queryClient.invalidateQueries({ queryKey: ["habit", variables.id] });
         toast.success("Habit updated successfully!");
      },
      onError: (err: { message?: string }) => {
         toast.error(err.message || "Failed to update habit");
      },
   });
};

export const useDeleteHabit = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) => habitsApi.deleteHabit(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["habits"] });
         queryClient.invalidateQueries({ queryKey: ["stats"] });
         toast.success("Habit deleted permanently");
      },
      onError: (err: { message?: string }) => {
         toast.error(err.message || "Failed to delete habit");
      },
   });
};

export const useArchiveHabit = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) => habitsApi.archiveHabit(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["habits"] });
         queryClient.invalidateQueries({ queryKey: ["stats"] });
         toast.success("Habit archived");
      },
      onError: (err: { message?: string }) => {
         toast.error(err.message || "Failed to archive habit");
      },
   });
};

export const useUnarchiveHabit = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) => habitsApi.unarchiveHabit(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["habits"] });
         queryClient.invalidateQueries({ queryKey: ["stats"] });
         toast.success("Habit restored to active list");
      },
      onError: (err: { message?: string }) => {
         toast.error(err.message || "Failed to restore habit");
      },
   });
};

export const useToggleCompletion = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async ({
         habitId,
         date,
         completed,
      }: {
         habitId: string;
         date: string;
         completed: boolean;
      }) => {
         if (completed) {
            return completionsApi.undoComplete(habitId, date);
         } else {
            return completionsApi.markComplete(habitId, date);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["habits"] });
         queryClient.invalidateQueries({ queryKey: ["completions"] });
         queryClient.invalidateQueries({ queryKey: ["stats"] });
      },
      onError: (err: { message?: string }) => {
         toast.error(err.message || "Failed to update completion");
      },
   });
};

export const useDashboardStats = (from?: string, to?: string) => {
   return useQuery({
      queryKey: ["stats", from, to],
      queryFn: () => dashboardApi.getStats(from, to),
   });
};

export const useHabitCompletions = (
   habitId: string | undefined,
   from?: string,
   to?: string,
) => {
   return useQuery({
      queryKey: ["completions", habitId, from, to],
      queryFn: () =>
         habitId ? completionsApi.getCompletions(habitId, from, to) : [],
      enabled: !!habitId,
   });
};
