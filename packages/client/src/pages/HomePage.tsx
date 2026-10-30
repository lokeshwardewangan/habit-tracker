import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
   Plus,
   Calendar as CalendarIcon,
   Flame,
   CheckCircle2,
   TrendingUp,
   Search,
   Target,
   Loader2,
   Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/HabitCard";
import { NewHabitModal } from "@/components/habits/NewHabitModal";
import { CalendarHistoryModal } from "@/components/habits/CalendarHistoryModal";
import { WeeklyConsistencyChart } from "@/features/dashboard";
import { exportHabitsToCsv } from "@/features/habits/utils/exportCsv";
import { ActionTooltip } from "@/components/ui/tooltip";
import type { HabitItem } from "@/types/habit";
import type { Habit } from "@/types/api";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import {
   useHabits,
   useDashboardStats,
   useToggleCompletion,
   useCreateHabit,
   useArchiveHabit,
   useTrashHabit,
} from "@/hooks/useHabits";
import { toast } from "sonner";
import { PASTEL_COLORS, STARTER_HABITS } from "@/constants/habits";

export const HomePage = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">(
      "all",
   );
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedHabitForCalendar, setSelectedHabitForCalendar] =
      useState<Habit | null>(null);

   const [todayFormatted] = useState(() => format(new Date(), "EEEE, MMMM d"));
   const [todayDateStr] = useState(() => format(new Date(), "yyyy-MM-dd"));
   const firstName = user?.firstName || "Tanay";

   // Live TanStack queries
   const { data: serverHabits = [], isLoading: isHabitsLoading } =
      useHabits("active");
   const { data: stats } = useDashboardStats();
   const toggleCompletion = useToggleCompletion();
   const createHabit = useCreateHabit();
   const archiveHabit = useArchiveHabit();
   const trashHabit = useTrashHabit();

   // Optimistic completion override state for instant UI feedback
   const [optimisticOverrides, setOptimisticOverrides] = useState<
      Record<string, boolean>
   >({});

   // Map backend habits to UI habit items
   const habitItems: HabitItem[] = useMemo(() => {
      return serverHabits.map((h, idx) => {
         const isCompletedToday =
            optimisticOverrides[h.id] !== undefined
               ? optimisticOverrides[h.id]
               : !!h.isCompletedToday;

         return {
            id: h.id,
            title: h.name,
            startDate: h.startDate,
            endDate: h.startDate,
            goalTimes: 1,
            currentTimes: isCompletedToday ? 1 : 0,
            repeat: h.frequency === "WEEKLY" ? "Weekly" : "Daily",
            colour: PASTEL_COLORS[idx % PASTEL_COLORS.length],
            status: isCompletedToday ? "Completed" : "Active",
            labels:
               h.labels && h.labels.length > 0
                  ? h.labels
                  : [
                       h.frequency === "WEEKLY"
                          ? "Weekly Routine"
                          : "Daily Routine",
                    ],
            streak: stats?.activeHabits || 1,
         };
      });
   }, [serverHabits, optimisticOverrides, stats]);

   // Handle checkmark click: toggle completion on backend API
   const handleToggleComplete = async (habitId: string) => {
      const habit = serverHabits.find((h) => h.id === habitId);
      const isCurrentlyCompleted =
         optimisticOverrides[habitId] !== undefined
            ? optimisticOverrides[habitId]
            : !!habit?.isCompletedToday;

      const nextCompleted = !isCurrentlyCompleted;

      // Optimistic update
      setOptimisticOverrides((prev) => ({
         ...prev,
         [habitId]: nextCompleted,
      }));

      try {
         await toggleCompletion.mutateAsync({
            habitId,
            date: todayDateStr,
            completed: isCurrentlyCompleted,
         });
         toast.success(
            isCurrentlyCompleted
               ? "Habit completion undone"
               : "Great job! Habit checked off for today.",
         );
      } catch {
         // Rollback optimistic state
         setOptimisticOverrides((prev) => ({
            ...prev,
            [habitId]: isCurrentlyCompleted,
         }));
      }
   };

   // Handle Card click -> Open Calendar History or Detail
   const handleCardClick = (habitId: string) => {
      const targetHabit = serverHabits.find((h) => h.id === habitId);
      if (targetHabit) {
         setSelectedHabitForCalendar(targetHabit);
      } else {
         navigate(`/habits/${habitId}`);
      }
   };

   // Seed Starter Habits directly into MongoDB
   const handleSeedStarterHabits = async () => {
      try {
         for (const item of STARTER_HABITS) {
            await createHabit.mutateAsync({
               name: item.name,
               startDate: todayDateStr,
               frequency: item.frequency,
            });
         }
         toast.success("Starter habits loaded into your account!");
      } catch {
         toast.error("Could not load starter habits");
      }
   };

   const activeList = habitItems.filter((h) => h.status === "Active");
   const completedList = habitItems.filter((h) => h.status === "Completed");

   const filteredHabits = habitItems.filter((h) => {
      if (filterTab === "active" && h.status !== "Active") return false;
      if (filterTab === "completed" && h.status !== "Completed") return false;
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase();
         return (
            h.title.toLowerCase().includes(q) ||
            h.labels.some((lbl) => lbl.toLowerCase().includes(q))
         );
      }
      return true;
   });

   const totalCount = activeList.length + completedList.length;
   const completionRate =
      totalCount > 0
         ? Math.round((completedList.length / totalCount) * 100)
         : 0;

   return (
      <div className="space-y-8 animate-in fade-in-50 duration-300">
         {/* Clean, Human Hero Header */}
         <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>{todayFormatted}</span>
               </div>
               <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  Welcome, {firstName} 👋
               </h1>
               <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  {activeList.length > 0
                     ? `You have ${activeList.length} routines remaining today. Keep up the steady momentum!`
                     : totalCount > 0
                       ? "All routines checked off for today! Outstanding consistency."
                       : "Start your journey today by creating your first healthy routine."}
               </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
               <ActionTooltip content="Export all habits data to CSV">
                  <Button
                     variant="outline"
                     onClick={() => {
                        exportHabitsToCsv(serverHabits);
                        toast.success("Habits exported to CSV!");
                     }}
                     disabled={serverHabits.length === 0}
                     className="h-11 px-4 rounded-xl border-border font-semibold text-xs flex items-center gap-2 cursor-pointer hover:bg-accent"
                     aria-label="Export all habits data to CSV"
                  >
                     <Download className="h-4 w-4" />
                     <span className="hidden sm:inline">Export CSV</span>
                  </Button>
               </ActionTooltip>

               <Button
                  onClick={() => setIsModalOpen(true)}
                  className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs text-sm flex items-center gap-2 cursor-pointer"
               >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Create Habit</span>
               </Button>
            </div>
         </div>

         {/* Refined Metric Overview Row */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Today's Progress */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Today's Progress</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
               </div>
               <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-foreground">
                     {completedList.length}{" "}
                     <span className="text-sm font-semibold text-muted-foreground">
                        / {totalCount} done
                     </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                     {completionRate}%
                  </span>
               </div>
               <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                     className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                     style={{ width: `${completionRate}%` }}
                  />
               </div>
            </div>

            {/* Overall Consistency */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Period Completion</span>
                  <TrendingUp className="h-4 w-4 text-primary" />
               </div>
               <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-foreground">
                     {stats ? `${Math.round(stats.completionRate)}%` : "0%"}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                     trailing 7 days
                  </span>
               </div>
               <p className="text-xs text-muted-foreground font-medium">
                  {stats?.totalCompletionsInPeriod || 0} completions recorded
               </p>
            </div>

            {/* Streak & Consistency */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Active Streaks</span>
                  <Flame className="h-4 w-4 text-amber-500" />
               </div>
               <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-amber-500">
                     {stats?.activeHabits
                        ? `${stats.activeHabits} Habits`
                        : "0"}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                     in routine
                  </span>
               </div>
               <p className="text-xs text-muted-foreground font-medium">
                  Consistency builds lasting habits
               </p>
            </div>
         </div>

         {/* Weekly Consistency Visual Chart */}
         <WeeklyConsistencyChart />

         {/* Workspace Routine Collection Header */}
         <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
               {/* Filter Tabs */}
               <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 w-fit">
                  <button
                     onClick={() => setFilterTab("all")}
                     className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterTab === "all"
                           ? "bg-card text-foreground shadow-2xs"
                           : "text-muted-foreground hover:text-foreground"
                     }`}
                  >
                     All ({habitItems.length})
                  </button>
                  <button
                     onClick={() => setFilterTab("active")}
                     className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterTab === "active"
                           ? "bg-card text-foreground shadow-2xs"
                           : "text-muted-foreground hover:text-foreground"
                     }`}
                  >
                     Active ({activeList.length})
                  </button>
                  <button
                     onClick={() => setFilterTab("completed")}
                     className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterTab === "completed"
                           ? "bg-card text-foreground shadow-2xs"
                           : "text-muted-foreground hover:text-foreground"
                     }`}
                  >
                     Completed ({completedList.length})
                  </button>
               </div>

               {/* Quick In-page Search */}
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                     type="text"
                     placeholder="Search routines..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
               </div>
            </div>

            {/* Loading State */}
            {isHabitsLoading ? (
               <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground font-semibold">
                     Loading your routines from MongoDB...
                  </p>
               </div>
            ) : filteredHabits.length > 0 ? (
               /* Cards Grid */
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredHabits.map((habit) => (
                     <HabitCard
                        key={habit.id}
                        habit={habit}
                        mode="home"
                        onToggleComplete={handleToggleComplete}
                        onCardClick={handleCardClick}
                        onArchive={(id: string) => archiveHabit.mutate(id)}
                        onTrash={(id: string) => trashHabit.mutate(id)}
                     />
                  ))}
               </div>
            ) : (
               /* Empty State */
               <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4 bg-card/40">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                     <Target className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                     <h3 className="text-base font-bold text-foreground">
                        {searchQuery
                           ? "No matching routines found"
                           : "No routines found"}
                     </h3>
                     <p className="text-xs text-muted-foreground">
                        {searchQuery
                           ? "Try clearing your search query or switching filters."
                           : "Get started by adding your first daily habit, or load our pre-configured starter routines."}
                     </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                     <Button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs px-4 py-2 cursor-pointer"
                     >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Create Habit
                     </Button>
                     {!searchQuery && serverHabits.length === 0 && (
                        <Button
                           variant="outline"
                           onClick={handleSeedStarterHabits}
                           disabled={createHabit.isPending}
                           className="rounded-xl border-border font-semibold text-xs px-4 py-2 cursor-pointer"
                        >
                           {createHabit.isPending ? (
                              <>
                                 <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                 Loading...
                              </>
                           ) : (
                              "⚡ Load Starter Habits"
                           )}
                        </Button>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* New Habit Modal */}
         <NewHabitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={async (habit) => {
               await createHabit.mutateAsync({
                  name: habit.title,
                  startDate: todayDateStr,
                  frequency: habit.repeat === "Weekly" ? "WEEKLY" : "DAILY",
                  labels: habit.labels,
               });
            }}
         />

         {/* Calendar History Modal */}
         <CalendarHistoryModal
            habit={selectedHabitForCalendar}
            isOpen={!!selectedHabitForCalendar}
            onClose={() => setSelectedHabitForCalendar(null)}
         />
      </div>
   );
};
