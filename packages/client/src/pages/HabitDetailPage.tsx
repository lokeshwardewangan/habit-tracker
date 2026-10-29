import { useParams, useNavigate, Link } from "react-router-dom";
import { Archive, Edit3, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { initialHabits } from "@/mock/staticData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabit, useArchiveHabit, useDeleteHabit } from "@/hooks/useHabits";

export const HabitDetailPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { data: serverHabit, isLoading } = useHabit(id);
   const archiveMutation = useArchiveHabit();
   const deleteMutation = useDeleteHabit();

   // Fallback to static mock if server habit is not found
   const fallbackHabit =
      initialHabits.find((h) => h.id === id) || initialHabits[0];

   const title = serverHabit?.name || fallbackHabit.title;
   const startDate = serverHabit?.startDate || fallbackHabit.startDate;
   const repeat = serverHabit?.frequency === "WEEKLY" ? "Weekly" : "Daily";
   const status = serverHabit?.status || fallbackHabit.status;

   const handleArchive = async () => {
      if (id) {
         await archiveMutation.mutateAsync(id);
         navigate("/archive");
      }
   };

   const handleDelete = async () => {
      if (id) {
         await deleteMutation.mutateAsync(id);
         navigate("/home");
      }
   };

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

   return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Header with Back button and Quick Actions */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => navigate("/home")}
                  className="rounded-xl cursor-pointer"
                  title="Back to Home"
               >
                  <ArrowLeft className="h-4 w-4" />
               </Button>
               <h1 className="text-2xl font-black tracking-tight text-foreground">
                  My Habit
               </h1>
            </div>

            {/* Figma Top-Right Actions: Archive, Edit, Trash */}
            <div className="flex items-center gap-1.5">
               <button
                  type="button"
                  onClick={handleArchive}
                  disabled={archiveMutation.isPending}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Archive Habit"
               >
                  <Archive className="h-4 w-4" />
               </button>
               <Link
                  to={`/habits/${id}/edit`}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Edit Habit"
               >
                  <Edit3 className="h-4 w-4" />
               </Link>
               <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  title="Move to Trash"
               >
                  <Trash2 className="h-4 w-4" />
               </button>
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
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs font-semibold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>Daily Routine</span>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
