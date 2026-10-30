import {
   Check,
   RotateCcw,
   Trash2,
   Archive,
   Calendar as CalendarIcon,
} from "lucide-react";
import type { HabitItem } from "@/types/habit";
import { cn } from "@/lib/utils";
import { COLOR_PALETTES } from "@/constants/habits";
import { ActionTooltip } from "@/components/ui/tooltip";

interface HabitCardProps {
   habit: HabitItem;
   mode?: "home" | "archive" | "trash";
   onToggleComplete?: (id: string) => void;
   onRestore?: (id: string) => void;
   onDeletePermanent?: (id: string) => void;
   onArchive?: (id: string) => void;
   onCardClick?: (id: string) => void;
   onClick?: () => void;
}

export const HabitCard = ({
   habit,
   mode = "home",
   onToggleComplete,
   onRestore,
   onDeletePermanent,
   onArchive,
   onCardClick,
   onClick,
}: HabitCardProps) => {
   const style = COLOR_PALETTES[habit.colour] || COLOR_PALETTES.blue;
   const isCompleted = habit.currentTimes >= habit.goalTimes;

   const handleCardClick = () => {
      if (onCardClick) {
         onCardClick(habit.id);
      } else if (onClick) {
         onClick();
      }
   };

   return (
      <div
         onClick={handleCardClick}
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
                  <div className="flex items-center gap-1.5 shrink-0">
                     {onArchive && (
                        <ActionTooltip content="Archive Habit">
                           <button
                              type="button"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onArchive(habit.id);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-transparent hover:border-border/60 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                              aria-label="Archive Habit"
                           >
                              <Archive className="h-3.5 w-3.5" />
                           </button>
                        </ActionTooltip>
                     )}
                     <ActionTooltip
                        content={
                           isCompleted ? "Mark incomplete" : "Mark as completed"
                        }
                     >
                        <button
                           type="button"
                           onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete?.(habit.id);
                           }}
                           className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full border transition-transform active:scale-90 bg-white/80 dark:bg-black/30 shadow-2xs cursor-pointer",
                              isCompleted ? style.checkBg : style.checkBorder,
                           )}
                           aria-label={
                              isCompleted ? "Completed" : "Mark as completed"
                           }
                        >
                           <Check
                              className={cn(
                                 "h-4 w-4 stroke-[3]",
                                 isCompleted ? "text-white" : "opacity-60",
                              )}
                           />
                        </button>
                     </ActionTooltip>
                  </div>
               )}

               {mode === "archive" && (
                  <ActionTooltip content="Restore Habit">
                     <button
                        type="button"
                        onClick={(e) => {
                           e.stopPropagation();
                           onRestore?.(habit.id);
                        }}
                        className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-muted-foreground hover:text-primary transition-colors shadow-2xs cursor-pointer"
                        aria-label="Restore Habit"
                     >
                        <RotateCcw className="h-4 w-4" />
                     </button>
                  </ActionTooltip>
               )}

               {mode === "trash" && (
                  <div className="flex items-center gap-1.5 shrink-0">
                     <ActionTooltip content="Restore Habit">
                        <button
                           type="button"
                           onClick={(e) => {
                              e.stopPropagation();
                              onRestore?.(habit.id);
                           }}
                           className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-muted-foreground hover:text-primary transition-colors shadow-2xs cursor-pointer"
                           aria-label="Restore Habit"
                        >
                           <RotateCcw className="h-4 w-4" />
                        </button>
                     </ActionTooltip>
                     <ActionTooltip content="Permanently Delete">
                        <button
                           type="button"
                           onClick={(e) => {
                              e.stopPropagation();
                              onDeletePermanent?.(habit.id);
                           }}
                           className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-muted-foreground hover:text-destructive transition-colors shadow-2xs cursor-pointer"
                           aria-label="Permanently Delete"
                        >
                           <Trash2 className="h-4 w-4" />
                        </button>
                     </ActionTooltip>
                  </div>
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
