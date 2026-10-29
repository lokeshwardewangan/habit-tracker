import type { Request, Response, NextFunction } from "express";
import {
   dashboardService,
   type DashboardService,
} from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/response.js";
import { UnauthorizedError } from "../utils/errors.js";

export class DashboardController {
   constructor(private service: DashboardService = dashboardService) {}

   private getUserId(req: Request): string {
      if (!req.user || !req.user.id) {
         throw new UnauthorizedError("Authentication required");
      }
      return req.user.id;
   }

   getStats = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const userId = this.getUserId(req);
         const from = req.query.from as string | undefined;
         const to = req.query.to as string | undefined;

         const stats = await this.service.getStats(userId, from, to);
         sendSuccess(res, stats, 200);
      } catch (error) {
         next(error);
      }
   };
}

export const dashboardController = new DashboardController();
