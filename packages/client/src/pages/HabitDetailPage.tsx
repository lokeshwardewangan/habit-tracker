import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Archive, Edit3, Trash2, ArrowLeft } from "lucide-react";
import { initialHabits } from "@/mock/staticData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const HabitDetailPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [habits] = useState(initialHabits);

   const habit = habits.find((h) => h.id === id) || habits[0];

   return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
         {/* Top Header with Back button and Quick Actions */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => navigate("/home")}
                  className="rounded-xl"
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
                  onClick={() => {
                     navigate("/archive");
                  }}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Archive Habit"
               >
                  <Archive className="h-4 w-4" />
               </button>
               <Link
                  to={`/habits/${habit?.id}/edit`}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Edit Habit"
               >
                  <Edit3 className="h-4 w-4" />
               </Link>
               <button
                  type="button"
                  onClick={() => {
                     navigate("/trash");
                  }}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
                     {habit?.title}
                  </div>
               </div>

               {/* Dates */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Start Date
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        {habit?.startDate}
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        End Date
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        {habit?.endDate}
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
                        {habit?.goalTimes} times
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Repeat
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground">
                        {habit?.repeat}
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
                        <span>{habit?.colour}</span>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Status
                     </div>
                     <div className="p-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground capitalize">
                        {habit?.status}
                     </div>
                  </div>
               </div>

               {/* Labels */}
               <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                     Labels
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {habit?.labels.map((lbl, idx) => (
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
