import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

interface ValidationOptions {
   body?: ZodSchema;
   query?: ZodSchema;
   params?: ZodSchema;
}

export const validate = (schemas: ValidationOptions) => {
   return async (
      req: Request,
      _res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         if (schemas.body) {
            req.body = await schemas.body.parseAsync(req.body);
         }
         if (schemas.query) {
            req.query = (await schemas.query.parseAsync(
               req.query,
            )) as Request["query"];
         }
         if (schemas.params) {
            req.params = (await schemas.params.parseAsync(
               req.params,
            )) as Request["params"];
         }
         next();
      } catch (error) {
         if (error instanceof ZodError) {
            const details: Record<string, string> = {};
            for (const issue of error.issues) {
               const field = issue.path.join(".") || "field";
               details[field] = issue.message;
            }
            const firstMessage =
               error.issues[0]?.message || "Validation failed";
            next(new ValidationError(firstMessage, details));
            return;
         }
         next(error);
      }
   };
};
