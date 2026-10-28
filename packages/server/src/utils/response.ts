import type { Response } from "express";

export interface ApiResponse<T = unknown> {
   success: boolean;
   data?: T;
   message?: string;
}

export const sendSuccess = <T>(
   res: Response,
   data?: T,
   statusCode: number = 200,
   message?: string,
): Response => {
   const payload: ApiResponse<T> = {
      success: true,
      ...(data !== undefined ? { data } : {}),
      ...(message ? { message } : {}),
   };
   return res.status(statusCode).json(payload);
};

export const sendRawJson = <T>(
   res: Response,
   data: T,
   statusCode: number = 200,
): Response => {
   return res.status(statusCode).json(data);
};
