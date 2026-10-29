import type { HabitColor, HabitRepeat } from "../types/habit";

export const PASTEL_COLORS: HabitColor[] = ["blue", "rose", "amber", "mint"];

export const COLOR_PALETTES: Record<
   HabitColor,
   {
      card: string;
      label: string;
      checkBorder: string;
      checkBg: string;
      accentText: string;
   }
> = {
   blue: {
      card: "bg-blue-50/80 border-blue-200/80 text-blue-950 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-100",
      label: "bg-blue-200/60 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
      checkBorder: "border-blue-300 text-blue-500",
      checkBg: "bg-blue-500 border-blue-500 text-white",
      accentText: "text-blue-700 dark:text-blue-300",
   },
   rose: {
      card: "bg-rose-50/80 border-rose-200/80 text-rose-950 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-100",
      label: "bg-rose-200/60 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
      checkBorder: "border-rose-300 text-rose-500",
      checkBg: "bg-rose-500 border-rose-500 text-white",
      accentText: "text-rose-700 dark:text-rose-300",
   },
   amber: {
      card: "bg-amber-50/80 border-amber-200/80 text-amber-950 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-100",
      label: "bg-amber-200/60 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
      checkBorder: "border-amber-300 text-amber-500",
      checkBg: "bg-amber-500 border-amber-500 text-white",
      accentText: "text-amber-700 dark:text-amber-300",
   },
   mint: {
      card: "bg-emerald-50/80 border-emerald-200/80 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-100",
      label: "bg-emerald-200/60 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
      checkBorder: "border-emerald-300 text-emerald-500",
      checkBg: "bg-emerald-500 border-emerald-500 text-white",
      accentText: "text-emerald-700 dark:text-emerald-300",
   },
   purple: {
      card: "bg-purple-50/80 border-purple-200/80 text-purple-950 dark:bg-purple-950/20 dark:border-purple-900/40 dark:text-purple-100",
      label: "bg-purple-200/60 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
      checkBorder: "border-purple-300 text-purple-500",
      checkBg: "bg-purple-500 border-purple-500 text-white",
      accentText: "text-purple-700 dark:text-purple-300",
   },
};

export const REPEAT_OPTIONS: HabitRepeat[] = [
   "Daily",
   "Weekly",
   "Monthly",
   "Once",
];

export const STARTER_HABITS = [
   { name: "Morning Run (5km)", frequency: "DAILY" as const },
   { name: "Deep Work (2 Hours)", frequency: "DAILY" as const },
   { name: "Read 20 Pages", frequency: "DAILY" as const },
   { name: "Drink 2L Water", frequency: "DAILY" as const },
];
