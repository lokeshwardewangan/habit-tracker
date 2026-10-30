import { useState } from "react";
import {
   format,
   startOfMonth,
   endOfMonth,
   eachDayOfInterval,
   isSameMonth,
   isToday,
   subMonths,
   addMonths,
   startOfWeek,
   endOfWeek,
   isFuture,
} from "date-fns";
import {
   ChevronLeft,
   ChevronRight,
   X,
   Check,
   Calendar as CalendarIcon,
   Loader2,
   Archive,
} from "lucide-react";
import {
   useHabitCompletions,
   useToggleCompletion,
   useArchiveHabit,
} from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import type { Habit } from "@/types/api";

interface CalendarHistoryModalProps {
   habit: Habit | null;
   isOpen: boolean;
   onClose: () => void;
}

export const CalendarHistoryModal = ({
   habit,
   isOpen,
   onClose,
}: CalendarHistoryModalProps) => {
   const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
   const toggleCompletion = useToggleCompletion();
   const archiveHabit = useArchiveHabit();

   const monthStart = startOfMonth(currentMonth);
   const monthEnd = endOfMonth(currentMonth);
   const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
   const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

   const fromDate = format(calendarStart, "yyyy-MM-dd");
   const toDate = format(calendarEnd, "yyyy-MM-dd");

   const { data: completions = [], isLoading } = useHabitCompletions(
      habit?.id,
      fromDate,
      toDate,
   );

   if (!isOpen || !habit) return null;

   const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
   const completedDates = new Set(completions.map((c) => c.date));

   const handleDayClick = (day: Date) => {
      if (isFuture(day) || !habit) return;
      const dateStr = format(day, "yyyy-MM-dd");
      const isCompleted = completedDates.has(dateStr);
      toggleCompletion.mutate({
         habitId: habit.id,
         date: dateStr,
         completed: isCompleted,
      });
   };

   const handleArchive = () => {
      if (habit) {
         archiveHabit.mutate(habit.id);
         onClose();
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
         <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
               <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                     <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-foreground truncate max-w-[260px]">
                        {habit.name}
                     </h3>
                     <p className="text-xs text-muted-foreground font-medium">
                        Completion History & Calendar
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleArchive}
                     className="h-8 gap-1.5 rounded-xl border-border text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                     title="Archive Routine"
                  >
                     <Archive className="h-3.5 w-3.5" />
                     <span>Archive</span>
                  </Button>
                  <button
                     type="button"
                     onClick={onClose}
                     className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                     <X className="h-5 w-5" />
                  </button>
               </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between py-4">
               <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                  className="rounded-xl border-border"
               >
                  <ChevronLeft className="h-4 w-4" />
               </Button>
               <h4 className="text-sm font-bold text-foreground">
                  {format(currentMonth, "MMMM yyyy")}
               </h4>
               <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                  className="rounded-xl border-border"
               >
                  <ChevronRight className="h-4 w-4" />
               </Button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground uppercase pb-2">
               <div>Mon</div>
               <div>Tue</div>
               <div>Wed</div>
               <div>Thu</div>
               <div>Fri</div>
               <div>Sat</div>
               <div>Sun</div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
               {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isCompleted = completedDates.has(dateStr);
                  const isCurrentDay = isToday(day);
                  const isFutureDate = isFuture(day) && !isCurrentDay;

                  return (
                     <button
                        key={dateStr}
                        type="button"
                        disabled={isFutureDate || toggleCompletion.isPending}
                        onClick={() => handleDayClick(day)}
                        className={`h-10 w-full rounded-xl flex flex-col items-center justify-center text-xs font-semibold relative transition-all cursor-pointer ${
                           !isCurrentMonth ? "opacity-30" : "opacity-100"
                        } ${
                           isCompleted
                              ? "bg-emerald-500 text-white font-bold shadow-xs hover:bg-emerald-600"
                              : isFutureDate
                                ? "text-muted-foreground/40 cursor-not-allowed"
                                : "text-foreground hover:bg-muted/70"
                        } ${
                           isCurrentDay && !isCompleted
                              ? "border-2 border-primary text-primary font-bold"
                              : ""
                        }`}
                        title={`${dateStr}: ${isCompleted ? "Completed" : "Not completed"}`}
                     >
                        <span>{format(day, "d")}</span>
                        {isCompleted && (
                           <Check className="h-3 w-3 stroke-[3] mt-0.5" />
                        )}
                     </button>
                  );
               })}
            </div>

            {/* Legend & Summary */}
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                     <span className="h-3 w-3 rounded-md bg-emerald-500 inline-block" />
                     <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="h-3 w-3 rounded-md border-2 border-primary inline-block" />
                     <span>Today</span>
                  </div>
               </div>

               <div className="font-semibold text-foreground flex items-center gap-1.5">
                  {isLoading && (
                     <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  )}
                  <span>{completions.length} total done in period</span>
               </div>
            </div>
         </div>
      </div>
   );
};
