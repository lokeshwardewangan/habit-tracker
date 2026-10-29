import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive as ArchiveIcon } from "lucide-react";
import { TopSearchHeader } from "@/components/layout/TopSearchHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import { initialHabits } from "@/mock/staticData";
import type { HabitItem } from "@/types/habit";

export const ArchivePage = () => {
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState("");
   const [archivedHabits, setArchivedHabits] = useState<HabitItem[]>(
      initialHabits.filter((h) => h.status === "Archived"),
   );

   const handleRestore = (id: string) => {
      setArchivedHabits((prev) => prev.filter((h) => h.id !== id));
   };

   const filteredHabits = archivedHabits.filter(
      (h) =>
         h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         h.labels.some((l) =>
            l.toLowerCase().includes(searchQuery.toLowerCase()),
         ),
   );

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
               {filteredHabits.length} habits archived
            </span>
         </div>

         {/* Grid of Archived Cards from Figma */}
         {filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {filteredHabits.map((habit) => (
                  <HabitCard
                     key={habit.id}
                     habit={habit}
                     mode="archive"
                     onRestore={handleRestore}
                     onClick={() => navigate(`/habits/${habit.id}`)}
                  />
               ))}
            </div>
         ) : (
            <div className="p-12 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card/40 space-y-2">
               <ArchiveIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
               <div className="font-semibold text-foreground">
                  No archived habits
               </div>
               <p className="text-xs max-w-sm mx-auto">
                  Habits you archive will appear here so you can review their
                  history or restore them anytime.
               </p>
            </div>
         )}
      </div>
   );
};
