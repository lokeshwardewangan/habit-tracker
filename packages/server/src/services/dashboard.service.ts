import {
   habitRepository,
   type HabitRepository,
} from "../repositories/habit.repository.js";
import {
   completionRepository,
   type CompletionRepository,
} from "../repositories/completion.repository.js";

export interface DashboardStatsResult {
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

export class DashboardService {
   constructor(
      private habitRepo: HabitRepository = habitRepository,
      private completionRepo: CompletionRepository = completionRepository,
   ) {}

   private formatDate(d: Date): string {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
   }

   private getDaysBetween(startDateStr: string, endDateStr: string): number {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const diffTime = end.getTime() - start.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
   }

   private getCurrentWeekRange(): { from: string; to: string } {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday...
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);

      const monday = new Date(now);
      monday.setDate(diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return {
         from: this.formatDate(monday),
         to: this.formatDate(sunday),
      };
   }

   async getStats(
      userId: string,
      fromQuery?: string,
      toQuery?: string,
   ): Promise<DashboardStatsResult> {
      const today = new Date();
      const todayStr = this.formatDate(today);

      // Default period: Last 30 days up to today
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29);

      const from = fromQuery || this.formatDate(thirtyDaysAgo);
      const to = toQuery || todayStr;

      // 1. Active habits count
      const activeHabits = await this.habitRepo.findAllByUser(userId, "ACTIVE");
      const activeHabitsCount = activeHabits.length;

      // 2. Completions this week (Monday to Sunday)
      const weekRange = this.getCurrentWeekRange();
      const completionsThisWeek = await this.completionRepo.countByUserAndRange(
         userId,
         weekRange.from,
         weekRange.to,
      );

      // 3. Total completions in selected period
      const totalCompletionsInPeriod =
         await this.completionRepo.countByUserAndRange(userId, from, to);

      // 4. Calculate documented completion rate denominator:
      // For each active habit, count days within [from, to] where day >= habit.startDate and day <= today
      // This ensures users are not penalized for days before a habit was started or for future days.
      const effectiveEndDate = to < todayStr ? to : todayStr;
      let totalExpectedInPeriod = 0;

      for (const habit of activeHabits) {
         const habitStart = habit.startDate > from ? habit.startDate : from;
         if (habitStart <= effectiveEndDate) {
            const days = this.getDaysBetween(habitStart, effectiveEndDate) + 1;
            totalExpectedInPeriod += Math.max(0, days);
         }
      }

      const completionRate =
         totalExpectedInPeriod > 0
            ? Math.round(
                 (Math.min(totalCompletionsInPeriod, totalExpectedInPeriod) /
                    totalExpectedInPeriod) *
                    1000,
              ) / 10
            : 0;

      return {
         period: { from, to },
         activeHabits: activeHabitsCount,
         completionsThisWeek,
         totalCompletionsInPeriod,
         totalExpectedInPeriod,
         completionRate,
         rateFormula:
            "Total completions in period / sum of eligible days since habit startDate (capped at period and today) * 100",
      };
   }
}

export const dashboardService = new DashboardService();
