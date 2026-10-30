import { useParams, useNavigate, Link } from "react-router-dom";
import { Archive, Edit3, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabit, useArchiveHabit, useTrashHabit } from "@/hooks/useHabits";
import { ActionTooltip } from "@/components/ui/tooltip";

export const HabitDetailPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { data: serverHabit, isLoading } = useHabit(id);
   const archiveMutation = useArchiveHabit();
   const trashMutation = useTrashHabit();

   if (isLoading) {
      return (
         <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-semibold">
               Loading habit details...
            </p>
         </div>
      );
   }

   if (!serverHabit) {
      return (
         <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base font-bold text-foreground">
               Habit not found or deleted
            </p>
            <Button
               onClick={() => navigate("/home")}
               className="rounded-xl cursor-pointer"
               size="sm"
            >
               Return to Dashboard
            </Button>
         </div>
      );
   }

   const title = serverHabit.name;
   const startDate = serverHabit.startDate;
   const repeat = serverHabit.frequency === "WEEKLY" ? "Weekly" : "Daily";
   const status = serverHabit.status === "ACTIVE" ? "Active" : "Archived";
   const habitLabels =
      serverHabit.labels && serverHabit.labels.length > 0
         ? serverHabit.labels
         : ["Daily Routine"];

   const handleArchive = async () => {
      if (id) {
         await archiveMutation.mutateAsync(id);
         navigate("/home");
      }
   };

   const handleTrash = async () => {
      if (id) {
         await trashMutation.mutateAsync(id);
         navigate("/trash");
      }
   };

   return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Header with Back button and Quick Actions */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
               <ActionTooltip content="Back to Home">
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     onClick={() => navigate("/home")}
                     className="rounded-xl cursor-pointer"
                     aria-label="Back to Home"
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
               </ActionTooltip>
               <h1 className="text-2xl font-black tracking-tight text-foreground">
                  My Habit
               </h1>
            </div>

            {/* Figma Top-Right Actions: Archive, Edit, Trash */}
            <div className="flex items-center gap-1.5">
               <ActionTooltip content="Archive Habit">
                  <button
                     type="button"
                     onClick={handleArchive}
                     disabled={archiveMutation.isPending}
                     className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                     aria-label="Archive Habit"
                  >
                     <Archive className="h-4 w-4" />
                  </button>
               </ActionTooltip>
               <ActionTooltip content="Edit Habit">
                  <Link
                     to={`/habits/${id}/edit`}
                     className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                     aria-label="Edit Habit"
                  >
                     <Edit3 className="h-4 w-4" />
                  </Link>
               </ActionTooltip>
               <ActionTooltip content="Move to Trash">
                  <button
                     type="button"
                     onClick={handleTrash}
                     disabled={trashMutation.isPending}
                     className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                     aria-label="Move to Trash"
                  >
                     <Trash2 className="h-4 w-4" />
                  </button>
               </ActionTooltip>
            </div>
         </div>

         {/* Habit Details Card Form */}
         <Card className="rounded-2xl border-border bg-card shadow-xs">
            <CardContent className="p-6 md:p-8 space-y-5">
               {/* Title */}
               <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                     Title
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm font-semibold text-foreground">
                     {title}
                  </div>
               </div>

               {/* Dates */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Start Date
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        {startDate}
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        End Date
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        {startDate}
                     </div>
                  </div>
               </div>

               {/* Goal & Repeat */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Goal
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        1 times
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Repeat
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        {repeat}
                     </div>
                  </div>
               </div>

               {/* Colour & Status */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Colour
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground flex items-center gap-2 capitalize">
                        <span className="h-3.5 w-3.5 rounded-full bg-primary" />
                        <span>Blue</span>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Status
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground capitalize">
                        {status}
                     </div>
                  </div>
               </div>

               {/* Labels */}
               <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                     Labels
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {habitLabels.map((lbl, idx) => (
                        <div
                           key={idx}
                           className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs font-semibold text-foreground"
                        >
                           <span className="h-2 w-2 rounded-full bg-primary" />
                           <span>{lbl}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
