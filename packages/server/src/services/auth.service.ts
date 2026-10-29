import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
   userRepository,
   type UserRepository,
} from "../repositories/user.repository.js";
import { env } from "../config/env.js";
import {
   ConflictError,
   UnauthorizedError,
   NotFoundError,
} from "../utils/errors.js";
import type { SignupInput, LoginInput } from "../validators/auth.validator.js";
import type { IUserDocument } from "../models/User.js";

export interface AuthResult {
   user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
   };
   token: string;
}

export class AuthService {
   constructor(private userRepo: UserRepository = userRepository) {}

   private generateToken(userId: string, email: string): string {
      return jwt.sign({ sub: userId, email }, env.JWT_SECRET, {
         expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      });
   }

   private formatUser(user: IUserDocument) {
      return {
         id: user._id.toString(),
         firstName: user.firstName,
         lastName: user.lastName,
         email: user.email,
      };
   }

   async signup(input: SignupInput): Promise<AuthResult> {
      const emailExists = await this.userRepo.existsByEmail(input.email);
      if (emailExists) {
         throw new ConflictError(
            "A user with this email address already exists",
         );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(input.password, salt);

      const user = await this.userRepo.create({
         firstName: input.firstName,
         lastName: input.lastName,
         email: input.email,
         password: hashedPassword,
      });

      const formattedUser = this.formatUser(user);
      const token = this.generateToken(formattedUser.id, formattedUser.email);

      return { user: formattedUser, token };
   }

   async login(input: LoginInput): Promise<AuthResult> {
      const user = await this.userRepo.findByEmail(input.email, true);
      if (!user || !user.password) {
         throw new UnauthorizedError("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) {
         throw new UnauthorizedError("Invalid email or password");
      }

      const formattedUser = this.formatUser(user);
      const token = this.generateToken(formattedUser.id, formattedUser.email);

      return { user: formattedUser, token };
   }

   async getCurrentUser(userId: string) {
      const user = await this.userRepo.findById(userId);
      if (!user) {
         throw new NotFoundError("User not found");
      }
      return this.formatUser(user);
   }
}

export const authService = new AuthService();
