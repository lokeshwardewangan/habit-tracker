import { useState, useMemo } from "react";
import { Archive as ArchiveIcon, Loader2, Sparkles } from "lucide-react";
import { TopSearchHeader } from "@/components/layout/TopSearchHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import type { HabitItem, HabitColor } from "@/types/habit";
import { useHabits, useUnarchiveHabit } from "@/hooks/useHabits";

const PASTEL_COLORS: HabitColor[] = ["blue", "rose", "amber", "mint"];

export const ArchivePage = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const { data: serverArchived = [], isLoading } = useHabits("archived");
   const unarchiveMutation = useUnarchiveHabit();

   const habitItems: HabitItem[] = useMemo(() => {
      return serverArchived.map((h, idx) => ({
         id: h.id,
         title: h.name,
         startDate: h.startDate,
         endDate: h.startDate,
         goalTimes: 1,
         currentTimes: 0,
         repeat: h.frequency === "WEEKLY" ? "Weekly" : "Daily",
         colour: PASTEL_COLORS[idx % PASTEL_COLORS.length],
         status: "Archived",
         labels: ["Archived Routine"],
         streak: 0,
      }));
   }, [serverArchived]);

   const filteredHabits = habitItems.filter(
      (h) =>
         h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         h.labels.some((l) =>
            l.toLowerCase().includes(searchQuery.toLowerCase()),
         ),
   );

   const handleRestore = (id: string) => {
      unarchiveMutation.mutate(id);
   };

   return (
      <div className="space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Search Bar */}
         <TopSearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search archived habits..."
         />

         {/* Header */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
               <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ArchiveIcon className="h-4 w-4" />
               </div>
               <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Archive
               </h1>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
               {serverArchived.length} habits archived
            </span>
         </div>

         {/* Grid of Archived Cards */}
         {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-xs text-muted-foreground font-semibold">
                  Loading archive...
               </p>
            </div>
         ) : filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {filteredHabits.map((habit) => (
                  <HabitCard
                     key={habit.id}
                     habit={habit}
                     mode="archive"
                     onRestore={handleRestore}
                  />
               ))}
            </div>
         ) : (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
               <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Sparkles className="h-5 w-5" />
               </div>
               <p className="text-sm font-bold text-foreground">
                  No archived habits
               </p>
               <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Habits that you archive from your home workspace will appear
                  here so you can review their history or restore them anytime.
               </p>
            </div>
         )}
      </div>
   );
};
