import { apiClient } from "./client";
import type { DashboardStats, ApiResponse } from "../types/api";

export const dashboardService = {
   getStats: async (from?: string, to?: string): Promise<DashboardStats> => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await apiClient.get<ApiResponse<DashboardStats>>(
         `/dashboard/stats${query}`,
      );
      return response.data.data!;
   },
};
