import { apiClient } from "./client";
import type { Completion, ApiResponse } from "../types/api";

export const completionsApi = {
   markComplete: async (habitId: string, date: string): Promise<Completion> => {
      const response = await apiClient.put<ApiResponse<Completion>>(
         `/habits/${habitId}/completions/${date}`,
      );
      return response.data.data!;
   },

   undoComplete: async (
      habitId: string,
      date: string,
   ): Promise<{ habitId: string; date: string; completed: boolean }> => {
      const response = await apiClient.delete<
         ApiResponse<{ habitId: string; date: string; completed: boolean }>
      >(`/habits/${habitId}/completions/${date}`);
      return response.data.data!;
   },

   getCompletions: async (
      habitId: string,
      from?: string,
      to?: string,
   ): Promise<Completion[]> => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await apiClient.get<ApiResponse<Completion[]>>(
         `/habits/${habitId}/completions${query}`,
      );
      return response.data.data || [];
   },
};
