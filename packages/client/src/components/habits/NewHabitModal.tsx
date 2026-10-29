import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HabitItem, HabitColor, HabitRepeat } from "@/types/habit";

interface NewHabitModalProps {
   isOpen: boolean;
   onClose: () => void;
   onCreate: (habit: HabitItem) => void;
   availableLabels?: string[];
}

export const NewHabitModal = ({
   isOpen,
   onClose,
   onCreate,
   availableLabels = ["Label 1", "Label 2", "Label 3"],
}: NewHabitModalProps) => {
   const [name, setName] = useState("");
   const [startDate, setStartDate] = useState("26/05/2021");
   const [endDate, setEndDate] = useState("27/06/2021");
   const [goalTimes, setGoalTimes] = useState<number>(1);
   const [repeat, setRepeat] = useState<HabitRepeat>("Daily");
   const [colour, setColour] = useState<HabitColor>("blue");
   const [selectedLabels, setSelectedLabels] = useState<string[]>(["Label 1"]);

   if (!isOpen) return null;

   const toggleLabel = (label: string) => {
      setSelectedLabels((prev) =>
         prev.includes(label)
            ? prev.filter((l) => l !== label)
            : [...prev, label],
      );
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      const newHabit: HabitItem = {
         id: `habit-${Date.now()}`,
         title: name,
         startDate,
         endDate,
         goalTimes,
         currentTimes: 0,
         repeat,
         colour,
         status: "Active",
         labels: selectedLabels,
         streak: 0,
      };

      onCreate(newHabit);
      setName("");
      onClose();
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
         <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
               <h2 className="text-xl font-bold tracking-tight text-foreground">
                  New Habit
               </h2>
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
               >
                  <X className="h-5 w-5" />
               </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="py-4 space-y-4">
               {/* Name */}
               <div className="space-y-1.5">
                  <Label htmlFor="habit-name">Name</Label>
                  <Input
                     id="habit-name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Enter name of your habit"
                     required
                     className="h-10"
                  />
               </div>

               {/* Dates Grid */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                     <Label htmlFor="start-date">Start Date</Label>
                     <Input
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="dd/mm/yyyy"
                        className="h-10"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <Label htmlFor="end-date">End Date</Label>
                     <Input
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="dd/mm/yyyy"
                        className="h-10"
                     />
                  </div>
               </div>

               {/* Goal Count */}
               <div className="space-y-1.5">
                  <Label htmlFor="goal-times">Goal</Label>
                  <select
                     id="goal-times"
                     value={goalTimes}
                     onChange={(e) => setGoalTimes(Number(e.target.value))}
                     className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                     <option value={1}>1 times</option>
                     <option value={2}>2 times</option>
                     <option value={3}>3 times</option>
                     <option value={5}>5 times</option>
                  </select>
               </div>

               {/* Repeat */}
               <div className="space-y-1.5">
                  <Label htmlFor="repeat">Repeat</Label>
                  <select
                     id="repeat"
                     value={repeat}
                     onChange={(e) => setRepeat(e.target.value as HabitRepeat)}
                     className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                     <option value="Daily">Daily</option>
                     <option value="Weekly">Weekly</option>
                     <option value="Monthly">Monthly</option>
                     <option value="Once">Once</option>
                  </select>
               </div>

               {/* Colour */}
               <div className="space-y-1.5">
                  <Label htmlFor="colour">Colour</Label>
                  <div className="flex items-center gap-2 pt-1">
                     {(
                        [
                           "blue",
                           "rose",
                           "amber",
                           "mint",
                           "purple",
                        ] as HabitColor[]
                     ).map((c) => (
                        <button
                           key={c}
                           type="button"
                           onClick={() => setColour(c)}
                           className={`h-7 w-7 rounded-full border-2 transition-transform ${
                              colour === c
                                 ? "scale-110 ring-2 ring-primary ring-offset-2"
                                 : "opacity-80"
                           } ${
                              c === "blue"
                                 ? "bg-blue-400 border-blue-500"
                                 : c === "rose"
                                   ? "bg-rose-400 border-rose-500"
                                   : c === "amber"
                                     ? "bg-amber-400 border-amber-500"
                                     : c === "mint"
                                       ? "bg-emerald-400 border-emerald-500"
                                       : "bg-purple-400 border-purple-500"
                           }`}
                           title={c}
                        />
                     ))}
                  </div>
               </div>

               {/* Select Labels */}
               <div className="space-y-2 pt-1">
                  <Label>Select Labels</Label>
                  <div className="space-y-1.5">
                     {availableLabels.map((lbl) => (
                        <label
                           key={lbl}
                           className="flex items-center gap-2.5 text-sm cursor-pointer select-none"
                        >
                           <input
                              type="checkbox"
                              checked={selectedLabels.includes(lbl)}
                              onChange={() => toggleLabel(lbl)}
                              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                           />
                           <span>{lbl}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {/* Bottom Done Button */}
               <div className="flex justify-end pt-4 border-t border-border">
                  <Button
                     type="submit"
                     className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
                  >
                     Done
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};
