import { useState } from "react";
import { Plus, Edit2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TopSearchHeader } from "@/components/layout/TopSearchHeader";
import { initialLabels } from "@/mock/staticData";
import type { HabitLabel } from "@/types/habit";

export const LabelsPage = () => {
   const [labels, setLabels] = useState<HabitLabel[]>(initialLabels);
   const [searchQuery, setSearchQuery] = useState("");
   const [newLabelName, setNewLabelName] = useState("");
   const [isCreating, setIsCreating] = useState(false);

   const filteredLabels = labels.filter((lbl) =>
      lbl.name.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   const handleAddLabel = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLabelName.trim()) return;

      const newLabel: HabitLabel = {
         id: `lbl-${Date.now()}`,
         name: newLabelName.trim(),
         count: 0,
      };

      setLabels((prev) => [...prev, newLabel]);
      setNewLabelName("");
      setIsCreating(false);
   };

   return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Search Bar */}
         <TopSearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search Labels, Habits..."
         />

         {/* Header Row: Title & + Create Label */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <h1 className="text-xl font-black uppercase tracking-wider text-foreground">
               Labels
            </h1>

            <Button
               onClick={() => setIsCreating((prev) => !prev)}
               variant="ghost"
               className="text-primary hover:text-primary/80 hover:bg-primary/10 font-bold text-sm flex items-center gap-1.5"
            >
               <Plus className="h-4 w-4 stroke-[3]" />
               <span>Create Label</span>
            </Button>
         </div>

         {/* New Label Input Form (if toggled) */}
         {isCreating && (
            <form
               onSubmit={handleAddLabel}
               className="flex items-center gap-3 p-4 rounded-2xl border border-primary/30 bg-primary/5 animate-in fade-in-0 duration-150"
            >
               <Tag className="h-5 w-5 text-primary shrink-0" />
               <Input
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Enter label name..."
                  autoFocus
                  className="h-10 bg-card"
               />
               <Button
                  type="submit"
                  size="sm"
                  className="h-10 px-5 font-bold rounded-xl"
               >
                  Save
               </Button>
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="h-10 rounded-xl"
               >
                  Cancel
               </Button>
            </form>
         )}

         {/* Labels List from Figma */}
         <div className="space-y-3">
            {filteredLabels.length > 0 ? (
               filteredLabels.map((lbl) => (
                  <Card
                     key={lbl.id}
                     className="rounded-2xl border-border bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors flex flex-row items-center justify-between"
                  >
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                           <Tag className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                           {lbl.name}
                        </span>
                     </div>

                     <button
                        type="button"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Label"
                     >
                        <Edit2 className="h-4 w-4" />
                     </button>
                  </Card>
               ))
            ) : (
               <div className="p-8 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card/40">
                  No labels found. Click "+ Create Label" to add your first
                  category.
               </div>
            )}
         </div>
      </div>
   );
};
