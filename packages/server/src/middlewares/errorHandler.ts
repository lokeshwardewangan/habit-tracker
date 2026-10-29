import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { env } from "../config/env.js";

export const errorHandler = (
   err: Error | AppError,
   req: Request,
   res: Response,
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   next: NextFunction,
): void => {
   // Handle known operational AppErrors
   if (err instanceof AppError) {
      res.status(err.statusCode).json({
         error: {
            code: err.code,
            message: err.message,
            ...(err.details ? { details: err.details } : {}),
         },
      });
      return;
   }

   // Handle Mongoose duplicate key error (code 11000)
   if ((err as { code?: number }).code === 11000) {
      const keyPattern = (err as { keyPattern?: Record<string, number> })
         .keyPattern;
      const field = keyPattern ? Object.keys(keyPattern).join(", ") : "field";
      res.status(409).json({
         error: {
            code: "CONFLICT",
            message: `Duplicate entry for ${field}`,
            details: { [field]: `${field} already exists` },
         },
      });
      return;
   }

   // Handle Mongoose ValidationErrors
   if (err.name === "ValidationError" && "errors" in err) {
      const mongooseErrors = (
         err as { errors: Record<string, { message: string }> }
      ).errors;
      const details: Record<string, string> = {};
      for (const key of Object.keys(mongooseErrors)) {
         const fieldError = mongooseErrors[key];
         if (fieldError) {
            details[key] = fieldError.message;
         }
      }

      res.status(400).json({
         error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details,
         },
      });
      return;
   }

   // Handle invalid JSON body
   if (
      "type" in err &&
      (err as { type: string }).type === "entity.parse.failed"
   ) {
      res.status(400).json({
         error: {
            code: "INVALID_JSON",
            message: "Malformed JSON payload in request body",
         },
      });
      return;
   }

   // Unhandled / Internal Server Errors
   console.error("💥 Unhandled Error:", err);
   res.status(500).json({
      error: {
         code: "INTERNAL_SERVER_ERROR",
         message:
            env.NODE_ENV === "production"
               ? "Internal server error"
               : err.message,
      },
   });
};
