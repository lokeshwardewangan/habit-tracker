import {
   habitRepository,
   type HabitRepository,
} from "../repositories/habit.repository.js";
import { Completion } from "../models/Completion.js";
import { NotFoundError } from "../utils/errors.js";
import type {
   CreateHabitInput,
   UpdateHabitInput,
} from "../validators/habit.validator.js";
import type { HabitStatus } from "../models/Habit.js";

export class HabitService {
   constructor(private habitRepo: HabitRepository = habitRepository) {}

   async createHabit(userId: string, input: CreateHabitInput) {
      const habit = await this.habitRepo.create({
         userId,
         name: input.name,
         description: input.description,
         startDate: input.startDate,
         frequency: input.frequency,
         status: "ACTIVE",
      });
      return habit.toJSON();
   }

   async getHabits(userId: string, statusQuery?: string) {
      let statusFilter: HabitStatus | undefined;
      if (statusQuery === "active") {
         statusFilter = "ACTIVE";
      } else if (statusQuery === "archived") {
         statusFilter = "ARCHIVED";
      }

      const habits = await this.habitRepo.findAllByUser(userId, statusFilter);
      return habits.map((h) => h.toJSON());
   }

   async getHabitById(userId: string, habitId: string) {
      const habit = await this.habitRepo.findByUserAndId(userId, habitId);
      if (!habit) {
         throw new NotFoundError("Habit not found");
      }
      return habit.toJSON();
   }

   async updateHabit(userId: string, habitId: string, input: UpdateHabitInput) {
      const habit = await this.habitRepo.findByUserAndId(userId, habitId);
      if (!habit) {
         throw new NotFoundError("Habit not found");
      }

      // Preserve completions while updating habit metadata
      const updated = await this.habitRepo.updateById(habitId, input);
      if (!updated) {
         throw new NotFoundError("Habit not found");
      }
      return updated.toJSON();
   }

   async archiveHabit(userId: string, habitId: string) {
      const habit = await this.habitRepo.findByUserAndId(userId, habitId);
      if (!habit) {
         throw new NotFoundError("Habit not found");
      }

      const updated = await this.habitRepo.updateById(habitId, {
         status: "ARCHIVED",
      });
      if (!updated) {
         throw new NotFoundError("Habit not found");
      }
      return updated.toJSON();
   }

   async unarchiveHabit(userId: string, habitId: string) {
      const habit = await this.habitRepo.findByUserAndId(userId, habitId);
      if (!habit) {
         throw new NotFoundError("Habit not found");
      }

      const updated = await this.habitRepo.updateById(habitId, {
         status: "ACTIVE",
      });
      if (!updated) {
         throw new NotFoundError("Habit not found");
      }
      return updated.toJSON();
   }

   async deleteHabit(userId: string, habitId: string) {
      const habit = await this.habitRepo.findByUserAndId(userId, habitId);
      if (!habit) {
         throw new NotFoundError("Habit not found");
      }

      // Remove the habit and cascade clean up its completion records
      await this.habitRepo.deleteById(habitId);
      await Completion.deleteMany({ habitId: habit._id }).exec();

      return { id: habitId, deleted: true };
   }
}

export const habitService = new HabitService();
