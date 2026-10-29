export interface ApiErrorDetails {
   code: string;
   message: string;
   details?: Record<string, string>;
}

export interface ApiErrorResponse {
   error: ApiErrorDetails;
}

export interface ApiResponse<T = unknown> {
   success: boolean;
   data?: T;
   message?: string;
}

export interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
}

export type HabitFrequency = "DAILY" | "WEEKLY";
export type HabitStatus = "ACTIVE" | "ARCHIVED";

export interface Habit {
   id: string;
   userId: string;
   name: string;
   description?: string;
   startDate: string;
   frequency: HabitFrequency;
   status: HabitStatus;
   createdAt: string;
   updatedAt: string;
}

export interface Completion {
   id: string;
   habitId: string;
   userId: string;
   date: string; // YYYY-MM-DD
   createdAt: string;
   updatedAt: string;
}

export interface DashboardStats {
   period: {
      from: string;
      to: string;
   };
   activeHabits: number;
   completionsThisWeek: number;
   totalCompletionsInPeriod: number;
   totalExpectedInPeriod: number;
   completionRate: number;
   rateFormula: string;
}
