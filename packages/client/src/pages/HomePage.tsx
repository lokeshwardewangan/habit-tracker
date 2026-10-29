import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   Plus,
   Calendar as CalendarIcon,
   Flame,
   CheckCircle2,
   TrendingUp,
   Search,
   Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/HabitCard";
import { NewHabitModal } from "@/components/habits/NewHabitModal";
import { initialHabits } from "@/mock/staticData";
import type { HabitItem } from "@/types/habit";
import { format } from "date-fns";

export const HomePage = () => {
   const navigate = useNavigate();
   const [habits, setHabits] = useState<HabitItem[]>(initialHabits);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">(
      "all",
   );
   const [searchQuery, setSearchQuery] = useState("");

   const [todayFormatted] = useState(() => format(new Date(), "EEEE, MMMM d"));

   // Toggle habit completion on checkmark click
   const handleToggleComplete = (id: string) => {
      setHabits((prev) =>
         prev.map((habit) => {
            if (habit.id === id) {
               const willBeCompleted = habit.status === "Active";
               return {
                  ...habit,
                  status: willBeCompleted ? "Completed" : "Active",
                  currentTimes: willBeCompleted ? habit.goalTimes : 0,
                  streak: willBeCompleted
                     ? (habit.streak || 0) + 1
                     : Math.max(0, (habit.streak || 1) - 1),
               };
            }
            return habit;
         }),
      );
   };

   const handleCreateHabit = (newHabit: HabitItem) => {
      setHabits((prev) => [newHabit, ...prev]);
   };

   const activeList = habits.filter((h) => h.status === "Active");
   const completedList = habits.filter((h) => h.status === "Completed");

   const filteredHabits = habits.filter((h) => {
      if (h.status !== "Active" && h.status !== "Completed") return false;
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
                  Welcome, Tanay 👋
               </h1>
               <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  {activeList.length > 0
                     ? `You have ${activeList.length} routines remaining today. Keep up the steady momentum!`
                     : "All routines checked off for today! Outstanding consistency."}
               </p>
            </div>

            {/* Quick action button */}
            <div className="flex items-center gap-3 shrink-0">
               <Button
                  onClick={() => setIsModalOpen(true)}
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs text-sm flex items-center gap-2"
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

            {/* Active Streak */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Best Active Streak</span>
                  <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
               </div>
               <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-foreground">
                     14{" "}
                     <span className="text-sm font-semibold text-muted-foreground">
                        days
                     </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                     On Fire
                  </span>
               </div>
               <div className="text-xs text-muted-foreground">
                  Task #4 has been completed 14 days straight
               </div>
            </div>

            {/* Consistency Index */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Monthly Consistency</span>
                  <TrendingUp className="h-4 w-4 text-primary" />
               </div>
               <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-foreground">
                     85{" "}
                     <span className="text-sm font-semibold text-muted-foreground">
                        / 100
                     </span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                     High
                  </span>
               </div>
               <div className="text-xs text-muted-foreground">
                  Calculated from your logged historical checkoffs
               </div>
            </div>
         </div>

         {/* Habit Section with Clean Filters & Search */}
         <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
               {/* Filter Tabs */}
               <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/80 w-fit">
                  <button
                     type="button"
                     onClick={() => setFilterTab("all")}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filterTab === "all"
                           ? "bg-card text-foreground shadow-2xs"
                           : "text-muted-foreground hover:text-foreground"
                     }`}
                  >
                     All ({totalCount})
                  </button>
                  <button
                     type="button"
                     onClick={() => setFilterTab("active")}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filterTab === "active"
                           ? "bg-card text-foreground shadow-2xs"
                           : "text-muted-foreground hover:text-foreground"
                     }`}
                  >
                     Active ({activeList.length})
                  </button>
                  <button
                     type="button"
                     onClick={() => setFilterTab("completed")}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filterTab === "completed"
                           ? "bg-card text-foreground shadow-2xs"
                           : "text-muted-foreground hover:text-foreground"
                     }`}
                  >
                     Completed ({completedList.length})
                  </button>
               </div>

               {/* Quick Search */}
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search habits..."
                     className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
               </div>
            </div>

            {/* Habits Grid */}
            {filteredHabits.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredHabits.map((habit) => (
                     <HabitCard
                        key={habit.id}
                        habit={habit}
                        mode="home"
                        onToggleComplete={handleToggleComplete}
                        onClick={() => navigate(`/habits/${habit.id}`)}
                     />
                  ))}
               </div>
            ) : (
               <div className="p-12 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
                  <Filter className="h-7 w-7 mx-auto text-muted-foreground/40" />
                  <div className="font-semibold text-foreground">
                     No habits found
                  </div>
                  <p className="text-xs max-w-sm mx-auto">
                     {searchQuery
                        ? `No results matching "${searchQuery}". Try a different keyword.`
                        : "No habits in this tab. Click '+ Create Habit' to add a new one."}
                  </p>
               </div>
            )}
         </div>

         {/* New Habit Modal */}
         <NewHabitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateHabit}
         />
      </div>
   );
};
