export type HabitColor = "blue" | "rose" | "amber" | "mint" | "purple";
export type HabitRepeat = "Daily" | "Weekly" | "Monthly" | "Once";
export type HabitStatus = "Active" | "Completed" | "Archived" | "Trash";

export interface HabitItem {
   id: string;
   title: string;
   startDate: string;
   endDate: string;
   goalTimes: number; // e.g. 1, 2
   currentTimes: number; // e.g. 0, 2
   repeat: HabitRepeat;
   colour: HabitColor;
   status: HabitStatus;
   labels: string[];
   streak?: number;
}

export interface HabitLabel {
   id: string;
   name: string;
   count?: number;
}
