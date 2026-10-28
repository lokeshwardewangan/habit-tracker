import { app } from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
   try {
      await connectDB();

      const server = app.listen(env.PORT, () => {
         console.log(
            `Server running in ${env.NODE_ENV} mode on port ${env.PORT}`,
         );
      });

      const shutdown = async () => {
         console.log("Shutting down server...");
         server.close(async () => {
            await disconnectDB();
            process.exit(0);
         });
      };

      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
   } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
   }
};

startServer();
