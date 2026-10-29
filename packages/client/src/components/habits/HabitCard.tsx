import {
   Check,
   RotateCcw,
   Trash2,
   Calendar as CalendarIcon,
} from "lucide-react";
import type { HabitItem, HabitColor } from "@/types/habit";
import { cn } from "@/lib/utils";

interface HabitCardProps {
   habit: HabitItem;
   mode?: "home" | "archive" | "trash";
   onToggleComplete?: (id: string) => void;
   onRestore?: (id: string) => void;
   onDeletePermanent?: (id: string) => void;
   onClick?: () => void;
}

const colorStyles: Record<
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

export const HabitCard = ({
   habit,
   mode = "home",
   onToggleComplete,
   onRestore,
   onDeletePermanent,
   onClick,
}: HabitCardProps) => {
   const style = colorStyles[habit.colour] || colorStyles.blue;
   const isCompleted = habit.currentTimes >= habit.goalTimes;

   return (
      <div
         onClick={onClick}
         className={cn(
            "group relative rounded-2xl border p-5 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]",
            style.card,
         )}
      >
         {/* Top Header: Title and Action */}
         <div>
            <div className="flex items-start justify-between gap-3 mb-2.5">
               <h3 className="text-lg font-bold tracking-tight line-clamp-1">
                  {habit.title}
               </h3>

               {/* Mode-specific Top-Right Action Button */}
               {mode === "home" && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete?.(habit.id);
                     }}
                     className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border transition-transform active:scale-90 bg-white/80 dark:bg-black/30 shadow-2xs",
                        isCompleted ? style.checkBg : style.checkBorder,
                     )}
                     title={isCompleted ? "Completed" : "Mark as completed"}
                  >
                     <Check
                        className={cn(
                           "h-4 w-4 stroke-[3]",
                           isCompleted ? "text-white" : "opacity-60",
                        )}
                     />
                  </button>
               )}

               {mode === "archive" && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.stopPropagation();
                        onRestore?.(habit.id);
                     }}
                     className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-muted-foreground hover:text-primary transition-colors shadow-2xs"
                     title="Restore Habit"
                  >
                     <RotateCcw className="h-4 w-4" />
                  </button>
               )}

               {mode === "trash" && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.stopPropagation();
                        onDeletePermanent?.(habit.id);
                     }}
                     className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-muted-foreground hover:text-destructive transition-colors shadow-2xs"
                     title="Permanently Delete"
                  >
                     <Trash2 className="h-4 w-4" />
                  </button>
               )}
            </div>

            {/* Label Tags */}
            {habit.labels.length > 0 && (
               <div className="flex flex-wrap gap-1.5 mb-3">
                  {habit.labels.map((label, idx) => (
                     <span
                        key={idx}
                        className={cn(
                           "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                           style.label,
                        )}
                     >
                        {label}
                     </span>
                  ))}
               </div>
            )}
         </div>

         {/* Bottom Footer Info */}
         <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
               <CalendarIcon className="h-3 w-3" />
               <span>
                  {habit.startDate} - {habit.endDate}
               </span>
            </div>

            <div className="flex items-center justify-between">
               <span className="text-xs font-bold tracking-wide">
                  {mode === "home"
                     ? `${habit.currentTimes}/${habit.goalTimes} times today`
                     : `${habit.goalTimes} times ${habit.repeat.toLowerCase()}`}
               </span>

               {habit.streak !== undefined && habit.streak > 0 && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                     🔥 {habit.streak}d streak
                  </span>
               )}
            </div>
         </div>
      </div>
   );
};
