import { apiClient } from "./client";
import type { Habit, ApiResponse, HabitFrequency } from "../types/api";

export interface CreateHabitPayload {
   name: string;
   description?: string;
   startDate: string;
   frequency: HabitFrequency;
   labels?: string[];
}

export interface UpdateHabitPayload {
   name?: string;
   description?: string;
   startDate?: string;
   frequency?: HabitFrequency;
   labels?: string[];
}

export const habitsService = {
   getHabits: async (
      status: "active" | "archived" | "trashed" | "all" = "active",
      date?: string,
   ): Promise<Habit[]> => {
      const url = date
         ? `/habits?status=${status}&date=${date}`
         : `/habits?status=${status}`;
      const response = await apiClient.get<ApiResponse<Habit[]>>(url);
      return response.data.data || [];
   },

   getHabitById: async (id: string): Promise<Habit> => {
      const response = await apiClient.get<ApiResponse<Habit>>(`/habits/${id}`);
      return response.data.data!;
   },

   createHabit: async (payload: CreateHabitPayload): Promise<Habit> => {
      const response = await apiClient.post<ApiResponse<Habit>>(
         "/habits",
         payload,
      );
      return response.data.data!;
   },

   updateHabit: async (
      id: string,
      payload: UpdateHabitPayload,
   ): Promise<Habit> => {
      const response = await apiClient.patch<ApiResponse<Habit>>(
         `/habits/${id}`,
         payload,
      );
      return response.data.data!;
   },

   deleteHabit: async (
      id: string,
   ): Promise<{ id: string; deleted: boolean }> => {
      const response = await apiClient.delete<
         ApiResponse<{ id: string; deleted: boolean }>
      >(`/habits/${id}`);
      return response.data.data!;
   },

   archiveHabit: async (id: string): Promise<Habit> => {
      const response = await apiClient.post<ApiResponse<Habit>>(
         `/habits/${id}/archive`,
      );
      return response.data.data!;
   },

   unarchiveHabit: async (id: string): Promise<Habit> => {
      const response = await apiClient.post<ApiResponse<Habit>>(
         `/habits/${id}/unarchive`,
      );
      return response.data.data!;
   },

   trashHabit: async (id: string): Promise<Habit> => {
      const response = await apiClient.post<ApiResponse<Habit>>(
         `/habits/${id}/trash`,
      );
      return response.data.data!;
   },

   restoreFromTrash: async (id: string): Promise<Habit> => {
      const response = await apiClient.post<ApiResponse<Habit>>(
         `/habits/${id}/restore`,
      );
      return response.data.data!;
   },
};
