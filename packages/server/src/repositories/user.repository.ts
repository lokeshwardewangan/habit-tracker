import { User, type IUserDocument } from "../models/User";

export class UserRepository {
   async findByEmail(
      email: string,
      includePassword = false,
   ): Promise<IUserDocument | null> {
      const query = User.findOne({ email: email.toLowerCase() });
      if (includePassword) {
         query.select("+password");
      }
      return query.exec();
   }

   async findById(id: string): Promise<IUserDocument | null> {
      return User.findById(id).exec();
   }

   async create(userData: {
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
   }): Promise<IUserDocument> {
      const user = new User({
         ...userData,
         email: userData.email.toLowerCase(),
      });
      return user.save();
   }

   async existsByEmail(email: string): Promise<boolean> {
      const count = await User.countDocuments({
         email: email.toLowerCase(),
      }).exec();
      return count > 0;
   }
}

export const userRepository = new UserRepository();
