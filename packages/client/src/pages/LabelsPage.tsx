import { useState } from "react";
import { Plus, Edit2, Tag, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TopSearchHeader } from "@/components/layout/TopSearchHeader";
import { initialLabels } from "@/mock/staticData";
import type { HabitLabel } from "@/types/habit";
import { toast } from "sonner";

export const LabelsPage = () => {
   const [labels, setLabels] = useState<HabitLabel[]>(initialLabels);
   const [searchQuery, setSearchQuery] = useState("");
   const [newLabelName, setNewLabelName] = useState("");
   const [isCreating, setIsCreating] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editingText, setEditingText] = useState("");

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
      toast.success(`Label "${newLabel.name}" created`);
   };

   const startEdit = (lbl: HabitLabel) => {
      setEditingId(lbl.id);
      setEditingText(lbl.name);
   };

   const saveEdit = (id: string) => {
      if (!editingText.trim()) return;
      setLabels((prev) =>
         prev.map((lbl) =>
            lbl.id === id ? { ...lbl, name: editingText.trim() } : lbl,
         ),
      );
      setEditingId(null);
      toast.success("Label updated");
   };

   const handleDeleteLabel = (id: string, name: string) => {
      setLabels((prev) => prev.filter((l) => l.id !== id));
      toast.success(`Label "${name}" removed`);
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
            <div>
               <h1 className="text-xl font-black uppercase tracking-wider text-foreground">
                  Labels
               </h1>
               <p className="text-xs text-muted-foreground mt-0.5">
                  Organize and categorize your habits by routine domains
               </p>
            </div>

            <Button
               onClick={() => setIsCreating((prev) => !prev)}
               variant="ghost"
               className="text-primary hover:text-primary/80 hover:bg-primary/10 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
            >
               <Plus className="h-4 w-4 stroke-[3]" />
               <span>Create Label</span>
            </Button>
         </div>

         {/* New Label Input Form */}
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
                  className="h-10 px-5 font-bold rounded-xl cursor-pointer"
               >
                  Save
               </Button>
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="h-10 rounded-xl cursor-pointer"
               >
                  Cancel
               </Button>
            </form>
         )}

         {/* Labels List */}
         <div className="space-y-3">
            {filteredLabels.length > 0 ? (
               filteredLabels.map((lbl) => (
                  <Card
                     key={lbl.id}
                     className="rounded-2xl border-border bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors flex flex-row items-center justify-between"
                  >
                     {editingId === lbl.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-3">
                           <Input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="h-9 text-sm"
                              autoFocus
                           />
                           <button
                              type="button"
                              onClick={() => saveEdit(lbl.id)}
                              className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
                              title="Save"
                           >
                              <Check className="h-4 w-4" />
                           </button>
                           <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-2 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
                              title="Cancel"
                           >
                              <X className="h-4 w-4" />
                           </button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              <Tag className="h-4 w-4" />
                           </div>
                           <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                              {lbl.name}
                           </span>
                        </div>
                     )}

                     {editingId !== lbl.id && (
                        <div className="flex items-center gap-1">
                           <button
                              type="button"
                              onClick={() => startEdit(lbl)}
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title="Edit Label"
                           >
                              <Edit2 className="h-4 w-4" />
                           </button>
                           <button
                              type="button"
                              onClick={() =>
                                 handleDeleteLabel(lbl.id, lbl.name)
                              }
                              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              title="Delete Label"
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                     )}
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
