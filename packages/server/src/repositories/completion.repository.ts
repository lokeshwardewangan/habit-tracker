import { Types } from "mongoose";
import { Completion, type ICompletionDocument } from "../models/Completion.js";

export class CompletionRepository {
   async upsert(
      habitId: string,
      userId: string,
      date: string,
   ): Promise<ICompletionDocument> {
      const hId = new Types.ObjectId(habitId);
      const uId = new Types.ObjectId(userId);

      const completion = await Completion.findOneAndUpdate(
         { habitId: hId, date },
         {
            $setOnInsert: {
               habitId: hId,
               userId: uId,
               date,
            },
         },
         {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
         },
      ).exec();

      return completion as ICompletionDocument;
   }

   async deleteByHabitAndDate(
      habitId: string,
      date: string,
   ): Promise<ICompletionDocument | null> {
      if (!Types.ObjectId.isValid(habitId)) return null;
      return Completion.findOneAndDelete({
         habitId: new Types.ObjectId(habitId),
         date,
      }).exec();
   }

   async findByHabitAndDate(
      habitId: string,
      date: string,
   ): Promise<ICompletionDocument | null> {
      if (!Types.ObjectId.isValid(habitId)) return null;
      return Completion.findOne({
         habitId: new Types.ObjectId(habitId),
         date,
      }).exec();
   }

   async findHistory(
      habitId: string,
      from?: string,
      to?: string,
   ): Promise<ICompletionDocument[]> {
      if (!Types.ObjectId.isValid(habitId)) return [];
      const filter: Record<string, unknown> = {
         habitId: new Types.ObjectId(habitId),
      };

      if (from || to) {
         const dateFilter: Record<string, string> = {};
         if (from) dateFilter.$gte = from;
         if (to) dateFilter.$lte = to;
         filter.date = dateFilter;
      }

      return Completion.find(filter).sort({ date: 1 }).exec();
   }

   async findCompletionsByUserAndRange(
      userId: string,
      from: string,
      to: string,
   ): Promise<ICompletionDocument[]> {
      if (!Types.ObjectId.isValid(userId)) return [];
      return Completion.find({
         userId: new Types.ObjectId(userId),
         date: { $gte: from, $lte: to },
      })
         .sort({ date: 1 })
         .exec();
   }

   async countByUserAndRange(
      userId: string,
      from: string,
      to: string,
   ): Promise<number> {
      if (!Types.ObjectId.isValid(userId)) return 0;
      return Completion.countDocuments({
         userId: new Types.ObjectId(userId),
         date: { $gte: from, $lte: to },
      }).exec();
   }
}

export const completionRepository = new CompletionRepository();
