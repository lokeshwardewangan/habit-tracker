import { useState } from "react";
import { Trash2 } from "lucide-react";
import { TopSearchHeader } from "@/components/layout/TopSearchHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import { initialHabits } from "@/mock/staticData";
import type { HabitItem } from "@/types/habit";

export const TrashPage = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [trashHabits, setTrashHabits] = useState<HabitItem[]>(
      initialHabits.filter((h) => h.status === "Trash"),
   );

   const handleDeletePermanent = (id: string) => {
      setTrashHabits((prev) => prev.filter((h) => h.id !== id));
   };

   const filteredHabits = trashHabits.filter(
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
               {filteredHabits.length} items in trash
            </span>
         </div>

         {/* Grid of Trash Cards from Figma */}
         {filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {filteredHabits.map((habit) => (
                  <HabitCard
                     key={habit.id}
                     habit={habit}
                     mode="trash"
                     onDeletePermanent={handleDeletePermanent}
                  />
               ))}
            </div>
         ) : (
            <div className="p-12 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card/40 space-y-2">
               <Trash2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
               <div className="font-semibold text-foreground">
                  Trash is empty
               </div>
               <p className="text-xs max-w-sm mx-auto">
                  Deleted habits will appear here. You can permanently delete
                  them whenever you wish.
               </p>
            </div>
         )}
      </div>
   );
};
