import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { initialHabits } from "@/mock/staticData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HabitRepeat, HabitColor, HabitStatus } from "@/types/habit";

export const HabitEditPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const habit = initialHabits.find((h) => h.id === id) || initialHabits[0];

   const [title, setTitle] = useState(habit?.title || "Habit Title");
   const [startDate, setStartDate] = useState(habit?.startDate || "26/05/2021");
   const [endDate, setEndDate] = useState(habit?.endDate || "26/05/2021");
   const [goalTimes, setGoalTimes] = useState(habit?.goalTimes || 1);
   const [repeat, setRepeat] = useState<HabitRepeat>(habit?.repeat || "Daily");
   const [colour, setColour] = useState<HabitColor>(habit?.colour || "blue");
   const [status, setStatus] = useState<HabitStatus>(habit?.status || "Active");
   const [labels, setLabels] = useState<string[]>(habit?.labels || ["Label 1"]);

   const toggleLabel = (lbl: string) => {
      setLabels((prev) =>
         prev.includes(lbl) ? prev.filter((l) => l !== lbl) : [...prev, lbl],
      );
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Navigate back to home or detail
      navigate(`/habits/${habit?.id}`);
   };

   return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Header */}
         <div className="flex items-center gap-3 pb-3 border-b border-border">
            <Button
               variant="ghost"
               size="icon-sm"
               onClick={() => navigate(`/habits/${habit?.id}`)}
               className="rounded-xl"
               title="Back"
            >
               <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
               Edit Habit
            </h1>
         </div>

         {/* Edit Form */}
         <Card className="rounded-2xl border-border bg-card shadow-xs">
            <CardContent className="p-6 md:p-8">
               <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div className="space-y-1.5">
                     <Label htmlFor="edit-title">Title</Label>
                     <Input
                        id="edit-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Habit Title"
                        required
                        className="h-10"
                     />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-start">Start Date</Label>
                        <Input
                           id="edit-start"
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           className="h-10"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-end">End Date</Label>
                        <Input
                           id="edit-end"
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                           className="h-10"
                        />
                     </div>
                  </div>

                  {/* Goal & Repeat */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-goal">Goal</Label>
                        <select
                           id="edit-goal"
                           value={goalTimes}
                           onChange={(e) =>
                              setGoalTimes(Number(e.target.value))
                           }
                           className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                           <option value={1}>1 times</option>
                           <option value={2}>2 times</option>
                           <option value={3}>3 times</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-repeat">Repeat</Label>
                        <select
                           id="edit-repeat"
                           value={repeat}
                           onChange={(e) =>
                              setRepeat(e.target.value as HabitRepeat)
                           }
                           className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                           <option value="Daily">Daily</option>
                           <option value="Weekly">Weekly</option>
                           <option value="Monthly">Monthly</option>
                        </select>
                     </div>
                  </div>

                  {/* Colour & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-colour">Colour</Label>
                        <select
                           id="edit-colour"
                           value={colour}
                           onChange={(e) =>
                              setColour(e.target.value as HabitColor)
                           }
                           className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize"
                        >
                           <option value="blue">Blue</option>
                           <option value="rose">Rose</option>
                           <option value="amber">Amber</option>
                           <option value="mint">Mint</option>
                           <option value="purple">Purple</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                           id="edit-status"
                           value={status}
                           onChange={(e) =>
                              setStatus(e.target.value as HabitStatus)
                           }
                           className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize"
                        >
                           <option value="Active">Active</option>
                           <option value="Completed">Completed</option>
                           <option value="Archived">Archived</option>
                        </select>
                     </div>
                  </div>

                  {/* Labels Checkboxes */}
                  <div className="space-y-2 pt-1">
                     <Label>Labels</Label>
                     <div className="space-y-2">
                        {["Label 1", "Label 2", "Label 3"].map((lbl) => (
                           <label
                              key={lbl}
                              className="flex items-center gap-2.5 text-sm cursor-pointer select-none"
                           >
                              <input
                                 type="checkbox"
                                 checked={labels.includes(lbl)}
                                 onChange={() => toggleLabel(lbl)}
                                 className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                              />
                              <span>{lbl}</span>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Bottom Done Action Button from Figma */}
                  <div className="flex justify-end pt-4 border-t border-border">
                     <Button
                        type="submit"
                        className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-xs"
                     >
                        Done
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};
