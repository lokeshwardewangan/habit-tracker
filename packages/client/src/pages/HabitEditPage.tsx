import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HabitRepeat, HabitColor, HabitStatus } from "@/types/habit";
import { useHabit, useUpdateHabit } from "@/hooks/useHabits";
import { useLabels } from "@/hooks/useLabels";
import { ActionTooltip } from "@/components/ui/tooltip";

interface EditFormProps {
   id: string;
   initialData: {
      title: string;
      startDate: string;
      endDate: string;
      goalTimes: number;
      repeat: HabitRepeat;
      colour: HabitColor;
      status: HabitStatus;
      labels: string[];
   };
}

const EditForm = ({ id, initialData }: EditFormProps) => {
   const navigate = useNavigate();
   const updateMutation = useUpdateHabit();
   const { availableLabels } = useLabels();

   const [title, setTitle] = useState(initialData.title);
   const [startDate, setStartDate] = useState(initialData.startDate);
   const [endDate, setEndDate] = useState(initialData.endDate);
   const [goalTimes, setGoalTimes] = useState(initialData.goalTimes);
   const [repeat, setRepeat] = useState<HabitRepeat>(initialData.repeat);
   const [colour, setColour] = useState<HabitColor>(initialData.colour);
   const [status, setStatus] = useState<HabitStatus>(initialData.status);
   const [labels, setLabels] = useState<string[]>(initialData.labels);

   const allLabels = Array.from(new Set([...availableLabels, ...labels]));

   const toggleLabel = (lbl: string) => {
      setLabels((prev) =>
         prev.includes(lbl) ? prev.filter((l) => l !== lbl) : [...prev, lbl],
      );
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateMutation.mutateAsync({
         id,
         payload: {
            name: title,
            frequency: repeat === "Weekly" ? "WEEKLY" : "DAILY",
            labels,
         },
      });
      navigate(`/habits/${id}`);
   };

   return (
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
                  onChange={(e) => setGoalTimes(Number(e.target.value))}
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
                  onChange={(e) => setRepeat(e.target.value as HabitRepeat)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
               >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Once">Once</option>
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
                  onChange={(e) => setColour(e.target.value as HabitColor)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  onChange={(e) => setStatus(e.target.value as HabitStatus)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
               >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
               </select>
            </div>
         </div>

         {/* Labels */}
         <div className="space-y-2 pt-1">
            <Label>Labels</Label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
               {allLabels.length > 0 ? (
                  allLabels.map((lbl) => (
                     <label
                        key={lbl}
                        className="flex items-center gap-2.5 text-sm cursor-pointer select-none py-0.5 hover:text-foreground"
                     >
                        <input
                           type="checkbox"
                           checked={labels.includes(lbl)}
                           onChange={() => toggleLabel(lbl)}
                           className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                        <span>{lbl}</span>
                     </label>
                  ))
               ) : (
                  <div className="text-xs text-muted-foreground py-1">
                     No labels available.
                  </div>
               )}
            </div>
         </div>

         {/* Bottom Done Action Button */}
         <div className="flex justify-end pt-4 border-t border-border">
            <Button
               type="submit"
               disabled={updateMutation.isPending}
               className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl cursor-pointer"
            >
               {updateMutation.isPending ? (
                  <>
                     <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                     Saving...
                  </>
               ) : (
                  "Done"
               )}
            </Button>
         </div>
      </form>
   );
};

export const HabitEditPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { data: serverHabit, isLoading } = useHabit(id);

   if (isLoading) {
      return (
         <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-semibold">
               Loading habit...
            </p>
         </div>
      );
   }

   if (!serverHabit || !id) {
      return (
         <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base font-bold text-foreground">
               Habit not found or deleted
            </p>
            <p className="text-xs text-muted-foreground">
               This routine cannot be edited because it does not exist.
            </p>
            <Button
               onClick={() => navigate("/home")}
               className="rounded-xl"
               size="sm"
            >
               Return to Dashboard
            </Button>
         </div>
      );
   }

   const formData = {
      title: serverHabit.name,
      startDate: serverHabit.startDate,
      endDate: serverHabit.startDate,
      goalTimes: 1,
      repeat: (serverHabit.frequency === "WEEKLY"
         ? "Weekly"
         : "Daily") as HabitRepeat,
      colour: "blue" as HabitColor,
      status: (serverHabit.status === "ACTIVE"
         ? "Active"
         : "Archived") as HabitStatus,
      labels:
         serverHabit.labels && serverHabit.labels.length > 0
            ? serverHabit.labels
            : ["Daily Routine"],
   };

   return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Header */}
         <div className="flex items-center gap-3 pb-3 border-b border-border">
            <ActionTooltip content="Back">
               <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => navigate(`/habits/${id}`)}
                  className="rounded-xl cursor-pointer"
                  aria-label="Back"
               >
                  <ArrowLeft className="h-4 w-4" />
               </Button>
            </ActionTooltip>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
               Edit Habit
            </h1>
         </div>

         {/* Edit Form */}
         <Card className="rounded-2xl border-border bg-card shadow-xs">
            <CardContent className="p-6 md:p-8">
               <EditForm key={serverHabit.id} id={id} initialData={formData} />
            </CardContent>
         </Card>
      </div>
   );
};
