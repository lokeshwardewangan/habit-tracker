import { Types } from "mongoose";
import {
   Habit,
   type IHabitDocument,
   type HabitStatus,
   type HabitFrequency,
} from "../models/Habit";

export interface CreateHabitDTO {
   userId: string;
   name: string;
   description?: string;
   startDate: string;
   frequency?: HabitFrequency;
   status?: HabitStatus;
}

export class HabitRepository {
   async create(data: CreateHabitDTO): Promise<IHabitDocument> {
      const habit = new Habit({
         ...data,
         userId: new Types.ObjectId(data.userId),
      });
      return habit.save();
   }

   async findById(id: string): Promise<IHabitDocument | null> {
      if (!Types.ObjectId.isValid(id)) return null;
      return Habit.findById(id).exec();
   }

   async findByUserAndId(
      userId: string,
      id: string,
   ): Promise<IHabitDocument | null> {
      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId))
         return null;
      return Habit.findOne({
         _id: new Types.ObjectId(id),
         userId: new Types.ObjectId(userId),
      }).exec();
   }

   async findAllByUser(
      userId: string,
      status?: HabitStatus,
   ): Promise<IHabitDocument[]> {
      if (!Types.ObjectId.isValid(userId)) return [];
      const filter: Record<string, unknown> = {
         userId: new Types.ObjectId(userId),
      };
      if (status) {
         filter.status = status;
      }
      return Habit.find(filter).sort({ createdAt: -1 }).exec();
   }

   async updateById(
      id: string,
      updateData: Partial<{
         name: string;
         description: string;
         startDate: string;
         frequency: HabitFrequency;
         status: HabitStatus;
      }>,
   ): Promise<IHabitDocument | null> {
      if (!Types.ObjectId.isValid(id)) return null;
      return Habit.findByIdAndUpdate(
         id,
         { $set: updateData },
         { new: true, runValidators: true },
      ).exec();
   }

   async deleteById(id: string): Promise<IHabitDocument | null> {
      if (!Types.ObjectId.isValid(id)) return null;
      return Habit.findByIdAndDelete(id).exec();
   }

   async countByUser(userId: string, status?: HabitStatus): Promise<number> {
      if (!Types.ObjectId.isValid(userId)) return 0;
      const filter: Record<string, unknown> = {
         userId: new Types.ObjectId(userId),
      };
      if (status) {
         filter.status = status;
      }
      return Habit.countDocuments(filter).exec();
   }
}

export const habitRepository = new HabitRepository();
