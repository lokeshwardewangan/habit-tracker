import { useState, useMemo } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { TopSearchHeader } from "@/components/layout/TopSearchHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import type { HabitItem } from "@/types/habit";
import {
   useHabits,
   useDeleteHabit,
   useRestoreFromTrash,
} from "@/hooks/useHabits";
import { PASTEL_COLORS } from "@/constants/habits";

export const TrashPage = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const { data: serverTrashed = [], isLoading } = useHabits("trashed");
   const deleteMutation = useDeleteHabit();
   const restoreMutation = useRestoreFromTrash();

   const habitItems: HabitItem[] = useMemo(() => {
      return serverTrashed.map((h, idx) => ({
         id: h.id,
         title: h.name,
         startDate: h.startDate,
         endDate: h.startDate,
         goalTimes: 1,
         currentTimes: 0,
         repeat: h.frequency === "WEEKLY" ? "Weekly" : "Daily",
         colour: PASTEL_COLORS[idx % PASTEL_COLORS.length],
         status: "Trash",
         labels:
            h.labels && h.labels.length > 0 ? h.labels : ["Trashed Routine"],
         streak: 0,
      }));
   }, [serverTrashed]);

   const filteredHabits = habitItems.filter(
      (h) =>
         h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         h.labels.some((l) =>
            l.toLowerCase().includes(searchQuery.toLowerCase()),
         ),
   );

   const handleDeletePermanent = (id: string) => {
      deleteMutation.mutate(id);
   };

   const handleRestore = (id: string) => {
      restoreMutation.mutate(id);
   };

   return (
      <div className="space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Search Bar */}
         <TopSearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search trash..."
         />

         {/* Header */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
               <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
               </div>
               <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Trash
               </h1>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
               {serverTrashed.length} items in trash
            </span>
         </div>

         {/* Grid of Trash Cards */}
         {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-xs text-muted-foreground font-semibold">
                  Loading trash...
               </p>
            </div>
         ) : filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {filteredHabits.map((habit) => (
                  <HabitCard
                     key={habit.id}
                     habit={habit}
                     mode="trash"
                     onRestore={handleRestore}
                     onDeletePermanent={handleDeletePermanent}
                  />
               ))}
            </div>
         ) : (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
               <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                  <Trash2 className="h-5 w-5" />
               </div>
               <p className="text-sm font-bold text-foreground">
                  Trash is clean & empty
               </p>
               <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Deleted habits will show here before being permanently removed
                  from your database.
               </p>
            </div>
         )}
      </div>
   );
};
