import type { Request, Response, NextFunction } from "express";
import { authService, type AuthService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { UnauthorizedError } from "../utils/errors";
import { env } from "../config/env";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AuthController {
   constructor(private service: AuthService = authService) {}

   private setAuthCookie(res: Response, token: string): void {
      res.cookie(COOKIE_NAME, token, {
         httpOnly: true,
         secure: env.NODE_ENV === "production",
         sameSite: env.NODE_ENV === "production" ? "none" : "lax",
         maxAge: COOKIE_MAX_AGE,
      });
   }

   private clearAuthCookie(res: Response): void {
      res.clearCookie(COOKIE_NAME, {
         httpOnly: true,
         secure: env.NODE_ENV === "production",
         sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      });
   }

   signup = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const result = await this.service.signup(req.body);
         this.setAuthCookie(res, result.token);
         sendSuccess(res, result, 201, "User registered successfully");
      } catch (error) {
         next(error);
      }
   };

   login = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         const result = await this.service.login(req.body);
         this.setAuthCookie(res, result.token);
         sendSuccess(res, result, 200, "Logged in successfully");
      } catch (error) {
         next(error);
      }
   };

   logout = async (
      _req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         this.clearAuthCookie(res);
         sendSuccess(res, null, 200, "Logged out successfully");
      } catch (error) {
         next(error);
      }
   };

   me = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ): Promise<void> => {
      try {
         if (!req.user) {
            throw new UnauthorizedError("Authentication required");
         }
         const user = await this.service.getCurrentUser(req.user.id);
         sendSuccess(res, { user }, 200);
      } catch (error) {
         next(error);
      }
   };
}

export const authController = new AuthController();
