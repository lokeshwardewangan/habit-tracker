import {
   completionRepository,
   type CompletionRepository,
} from "../repositories/completion.repository";
import {
   habitRepository,
   type HabitRepository,
} from "../repositories/habit.repository";
import { NotFoundError } from "../utils/errors";

export class CompletionService {
   constructor(
      private completionRepo: CompletionRepository = completionRepository,
      private habitRepo: HabitRepository = habitRepository,
   ) {}

   private async verifyHabitOwnership(userId: string, habitId: string) {
      const habit = await this.habitRepo.findByUserAndId(userId, habitId);
      if (!habit) {
         throw new NotFoundError("Habit not found");
      }
      return habit;
   }

   async markComplete(userId: string, habitId: string, date: string) {
      await this.verifyHabitOwnership(userId, habitId);
      const completion = await this.completionRepo.upsert(
         habitId,
         userId,
         date,
      );
      return completion.toJSON();
   }

   async undoComplete(userId: string, habitId: string, date: string) {
      await this.verifyHabitOwnership(userId, habitId);
      await this.completionRepo.deleteByHabitAndDate(habitId, date);
      return { habitId, date, completed: false };
   }

   async getCompletions(
      userId: string,
      habitId: string,
      from?: string,
      to?: string,
   ) {
      await this.verifyHabitOwnership(userId, habitId);
      const completions = await this.completionRepo.findHistory(
         habitId,
         from,
         to,
      );
      return completions.map((c) => c.toJSON());
   }
}

export const completionService = new CompletionService();
