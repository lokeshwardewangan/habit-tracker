import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../utils/errors.js";

export interface AuthenticatedUser {
   id: string;
   email: string;
}

declare global {
   namespace Express {
      interface Request {
         user?: AuthenticatedUser;
      }
   }
}

export const authenticate = (
   req: Request,
   _res: Response,
   next: NextFunction,
): void => {
   try {
      let token: string | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
         token = authHeader.split(" ")[1];
      } else if (req.cookies && req.cookies.token) {
         token = req.cookies.token;
      }

      if (!token) {
         throw new UnauthorizedError("Authentication token is required");
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as {
         sub: string;
         email: string;
      };

      if (!decoded || !decoded.sub) {
         throw new UnauthorizedError("Invalid authentication token");
      }

      req.user = {
         id: decoded.sub,
         email: decoded.email,
      };

      next();
   } catch (error) {
      if (
         error instanceof jwt.JsonWebTokenError ||
         error instanceof jwt.TokenExpiredError
      ) {
         next(new UnauthorizedError("Invalid or expired authentication token"));
         return;
      }
      next(error);
   }
};
