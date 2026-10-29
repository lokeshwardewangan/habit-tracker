import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

export const setupTestDB = async (): Promise<void> => {
   try {
      mongoServer = await MongoMemoryServer.create({
         instance: {
            dbName: "habit_tracker_test",
         },
      });
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
   } catch {
      // Fallback to local test database if binary download fails or is slow
      const fallbackUri =
         process.env.TEST_MONGO_URI ||
         "mongodb://127.0.0.1:27017/habit_tracker_test";
      await mongoose.connect(fallbackUri);
   }
};

export const clearTestDB = async (): Promise<void> => {
   const collections = mongoose.connection.collections;
   for (const key of Object.keys(collections)) {
      const collection = collections[key];
      if (collection) {
         await collection.deleteMany({});
      }
   }
};

export const teardownTestDB = async (): Promise<void> => {
   await mongoose.disconnect();
   if (mongoServer) {
      await mongoServer.stop();
   }
};
