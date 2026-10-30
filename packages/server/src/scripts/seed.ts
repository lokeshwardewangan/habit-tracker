import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { Habit } from "../models/Habit.js";
import { Completion } from "../models/Completion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI =
   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit_tracker";

const formatDate = (date: Date): string => {
   const y = date.getFullYear();
   const m = String(date.getMonth() + 1).padStart(2, "0");
   const d = String(date.getDate()).padStart(2, "0");
   return `${y}-${m}-${d}`;
};

const getPastDateStr = (daysAgo: number): string => {
   const date = new Date();
   date.setDate(date.getDate() - daysAgo);
   return formatDate(date);
};

async function seed() {
   console.log(
      "Connecting to MongoDB:",
      MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"),
   );
   await mongoose.connect(MONGO_URI);
   console.log("MongoDB Connected successfully.");

   const email = "tanay@habittracker.com";
   const plainPassword = "Password123!";
   const hashedPassword = await bcrypt.hash(plainPassword, 10);

   // 1. Create or Update User
   let user = await User.findOne({ email });
   if (user) {
      user.firstName = "Tanay";
      user.lastName = "Pratap";
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated existing user: ${email}`);
   } else {
      user = await User.create({
         firstName: "Tanay",
         lastName: "Pratap",
         email,
         password: hashedPassword,
      });
      console.log(`Created new user: ${email}`);
   }

   const userId = user._id;

   // 2. Remove all old/unnecessary data for this user
   const deletedHabits = await Habit.deleteMany({ userId });
   const deletedCompletions = await Completion.deleteMany({ userId });
   console.log(
      `Cleared previous data for ${email} (${deletedHabits.deletedCount} habits, ${deletedCompletions.deletedCount} completions).`,
   );

   const todayStr = getPastDateStr(0);

   // 3. Seed Clean Active Habits
   const activeHabitsData = [
      {
         userId,
         name: "Morning 5km Jog",
         description:
            "Daily outdoor cardio to build stamina and maintain energy levels",
         startDate: getPastDateStr(21),
         frequency: "DAILY" as const,
         status: "ACTIVE" as const,
         labels: ["Health & Fitness", "Daily Routine"],
      },
      {
         userId,
         name: "Deep Work & Code",
         description:
            "2 hours of distraction-free architecture and software engineering",
         startDate: getPastDateStr(30),
         frequency: "DAILY" as const,
         status: "ACTIVE" as const,
         labels: ["Deep Work"],
      },
      {
         userId,
         name: "Read 20 Pages",
         description:
            "Read philosophy, psychology, or technical system design literature",
         startDate: getPastDateStr(14),
         frequency: "DAILY" as const,
         status: "ACTIVE" as const,
         labels: ["Daily Routine", "Mindfulness"],
      },
      {
         userId,
         name: "Meditation & Breathwork",
         description: "15 minutes of box breathing and mindfulness meditation",
         startDate: getPastDateStr(10),
         frequency: "DAILY" as const,
         status: "ACTIVE" as const,
         labels: ["Mindfulness"],
      },
      {
         userId,
         name: "Review Weekly Goals",
         description:
            "Analyze weekly KPIs, retrospectives, and project milestones",
         startDate: getPastDateStr(28),
         frequency: "WEEKLY" as const,
         status: "ACTIVE" as const,
         labels: ["Deep Work"],
      },
   ];

   const createdActiveHabits = await Habit.insertMany(activeHabitsData);
   console.log(`Created ${createdActiveHabits.length} active habits.`);

   // 4. Seed Archived Habits
   const archivedHabitsData = [
      {
         userId,
         name: "Couch to 5K Training",
         description: "Completed 8-week beginners running progression program",
         startDate: getPastDateStr(60),
         frequency: "DAILY" as const,
         status: "ARCHIVED" as const,
         labels: ["Health & Fitness"],
      },
      {
         userId,
         name: "Learn French Vocabulary",
         description: "French basics on Duolingo completed for European trip",
         startDate: getPastDateStr(90),
         frequency: "DAILY" as const,
         status: "ARCHIVED" as const,
         labels: ["Daily Routine"],
      },
   ];
   const createdArchivedHabits = await Habit.insertMany(archivedHabitsData);
   console.log(`Created ${createdArchivedHabits.length} archived habits.`);

   // 5. Seed Trashed Habits
   const trashedHabitsData = [
      {
         userId,
         name: "Old Gym Split (2025)",
         description: "Deprecated bodybuilding routine replaced by 5km jog",
         startDate: getPastDateStr(45),
         frequency: "DAILY" as const,
         status: "TRASHED" as const,
         labels: ["Health & Fitness"],
      },
      {
         userId,
         name: "Temporary Trial Routine",
         description: "Test routine ready for permanent purge or restoration",
         startDate: getPastDateStr(15),
         frequency: "WEEKLY" as const,
         status: "TRASHED" as const,
         labels: ["Daily Routine"],
      },
   ];
   const createdTrashedHabits = await Habit.insertMany(trashedHabitsData);
   console.log(`Created ${createdTrashedHabits.length} trashed habits.`);

   // 6. Seed Realistic Historical Completions
   // Let's create completions for the past 7 days
   const completionsToInsert: {
      habitId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      date: string;
   }[] = [];

   const [jog, deepWork, read, meditate, weeklyReview] = createdActiveHabits;

   // Jog: completed today and past 5 days (6-day streak)
   for (let i = 0; i <= 5; i++) {
      completionsToInsert.push({
         habitId: jog._id,
         userId,
         date: getPastDateStr(i),
      });
   }

   // Deep Work: completed today and past 6 days (7-day streak)
   for (let i = 0; i <= 6; i++) {
      completionsToInsert.push({
         habitId: deepWork._id,
         userId,
         date: getPastDateStr(i),
      });
   }

   // Read: completed on days 1, 2, 4 (not completed today, so user can check off!)
   [1, 2, 4].forEach((daysAgo) => {
      completionsToInsert.push({
         habitId: read._id,
         userId,
         date: getPastDateStr(daysAgo),
      });
   });

   // Meditate: completed today and days 1, 2, 3 (4-day streak)
   [0, 1, 2, 3].forEach((daysAgo) => {
      completionsToInsert.push({
         habitId: meditate._id,
         userId,
         date: getPastDateStr(daysAgo),
      });
   });

   // Weekly Review: completed on day 7
   completionsToInsert.push({
      habitId: weeklyReview._id,
      userId,
      date: getPastDateStr(7),
   });

   await Completion.insertMany(completionsToInsert);
   console.log(
      `Created ${completionsToInsert.length} completions across recent days.`,
   );

   console.log("\n=========================================");
   console.log("Seeding Complete!");
   console.log("Credentials:");
   console.log("  Email:    tanay@habittracker.com");
   console.log("  Password: Password123!");
   console.log("Active Habits:    5");
   console.log("Archived Habits:  2");
   console.log("Trashed Habits:   2");
   console.log("Total Completions: " + completionsToInsert.length);
   console.log("=========================================\n");

   await mongoose.disconnect();
}

seed().catch((err) => {
   console.error("Seed failed:", err);
   process.exit(1);
});
