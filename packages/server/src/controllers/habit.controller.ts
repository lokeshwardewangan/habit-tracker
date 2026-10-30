import type { Request, Response, NextFunction } from "express";
import { habitService, type HabitService } from "../services/habit.service.js";
import { sendSuccess } from "../utils/response.js";
import { UnauthorizedError } from "../utils/errors.js";

export class HabitController {
   constructor(private service: HabitService = habitService) {}

   private getUserId(req: Request): string {
      if (!req.user || !req.user.id) {
         throw new UnauthorizedError("Authentication required");
      }
      return req.user.id;
   }

   create = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.createHabit(userId, req.body);
         sendSuccess(res, habit, 201, "Habit created successfully");
      } catch (error) {
         next(error);
      }
   };

   list = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const status = req.query.status as string | undefined;
         const date = req.query.date as string | undefined;
         const habits = await this.service.getHabits(userId, status, date);
         sendSuccess(res, habits, 200);
      } catch (error) {
         next(error);
      }
   };

   getById = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.getHabitById(
            userId,
            req.params.id as string,
         );
         sendSuccess(res, habit, 200);
      } catch (error) {
         next(error);
      }
   };

   update = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.updateHabit(
            userId,
            req.params.id as string,
            req.body,
         );
         sendSuccess(res, habit, 200, "Habit updated successfully");
      } catch (error) {
         next(error);
      }
   };

   delete = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const result = await this.service.deleteHabit(
            userId,
            req.params.id as string,
         );
         sendSuccess(res, result, 200, "Habit deleted successfully");
      } catch (error) {
         next(error);
      }
   };

   archive = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.archiveHabit(
            userId,
            req.params.id as string,
         );
         sendSuccess(res, habit, 200, "Habit archived successfully");
      } catch (error) {
         next(error);
      }
   };

   unarchive = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.unarchiveHabit(
            userId,
            req.params.id as string,
         );
         sendSuccess(res, habit, 200, "Habit unarchived successfully");
      } catch (error) {
         next(error);
      }
   };

   trash = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.trashHabit(
            userId,
            req.params.id as string,
         );
         sendSuccess(res, habit, 200, "Habit moved to trash");
      } catch (error) {
         next(error);
      }
   };

   restore = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const habit = await this.service.restoreFromTrash(
            userId,
            req.params.id as string,
         );
         sendSuccess(res, habit, 200, "Habit restored from trash");
      } catch (error) {
         next(error);
      }
   };
}

export const habitController = new HabitController();
