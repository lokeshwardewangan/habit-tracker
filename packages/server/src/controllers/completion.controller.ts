import type { Request, Response, NextFunction } from "express";
import {
   completionService,
   type CompletionService,
} from "../services/completion.service";
import { sendSuccess } from "../utils/response";
import { UnauthorizedError } from "../utils/errors";

export class CompletionController {
   constructor(private service: CompletionService = completionService) {}

   private getUserId(req: Request): string {
      if (!req.user || !req.user.id) {
         throw new UnauthorizedError("Authentication required");
      }
      return req.user.id;
   }

   markComplete = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const { id, date } = req.params as { id: string; date: string };
         const result = await this.service.markComplete(userId, id, date);
         sendSuccess(res, result, 200, "Habit marked as complete");
      } catch (error) {
         next(error);
      }
   };

   undoComplete = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const { id, date } = req.params as { id: string; date: string };
         const result = await this.service.undoComplete(userId, id, date);
         sendSuccess(res, result, 200, "Habit completion undone");
      } catch (error) {
         next(error);
      }
   };

   listCompletions = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const { id } = req.params as { id: string };
         const from = req.query.from as string | undefined;
         const to = req.query.to as string | undefined;
         const completions = await this.service.getCompletions(
            userId,
            id,
            from,
            to,
         );
         sendSuccess(res, completions, 200);
      } catch (error) {
         next(error);
      }
   };
}

export const completionController = new CompletionController();
