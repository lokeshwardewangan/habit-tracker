import {
   Flame,
   Clock,
   Target,
   Smile,
   Quote,
   User as UserIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useDashboardStats, useHabits } from "@/hooks/useHabits";

export const ProfilePage = () => {
   const { user } = useAuth();
   const { data: stats } = useDashboardStats();
   const { data: habits = [] } = useHabits("active");

   const fullName = user
      ? `${user.firstName} ${user.lastName}`
      : "Tanay Pratap";
   const email = user ? user.email : "tanay@example.com";
   const habitScore = stats?.completionRate ?? 85;
   const activeStreak = habits.length;
   const todayCompletedCount = stats?.totalCompletionsInPeriod ?? 0;
   return (
      <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in-50 duration-200">
         {/* Top Header */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
               My Profile
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
               <span className="h-2 w-2 rounded-full bg-emerald-500" />
               <span>Active Account</span>
            </div>
         </div>

         {/* 4 Stat Cards in a row from Figma Screen 9 */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current Streak */}
            <Card className="rounded-2xl border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                     Current Streak
                  </span>
                  <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
               </div>
               <div className="space-y-0.5">
                  <div className="text-3xl font-extrabold text-foreground">
                     {activeStreak}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold">
                     active routines
                  </div>
               </div>
            </Card>

            {/* Today Completed */}
            <Card className="rounded-2xl border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                     Completions
                  </span>
                  <Clock className="h-4 w-4 text-blue-500" />
               </div>
               <div className="space-y-0.5">
                  <div className="text-3xl font-extrabold text-foreground">
                     {todayCompletedCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold">
                     logged records
                  </div>
               </div>
            </Card>

            {/* Habit Score */}
            <Card className="rounded-2xl border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                     Habit Score
                  </span>
                  <Target className="h-4 w-4 text-rose-500" />
               </div>
               <div className="space-y-0.5">
                  <div className="text-3xl font-extrabold text-foreground">
                     {habitScore}{" "}
                     <span className="text-sm font-semibold text-muted-foreground">
                        /100
                     </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold">
                     consistency index
                  </div>
               </div>
            </Card>

            {/* Mood Score */}
            <Card className="rounded-2xl border-border bg-card p-5 shadow-2xs space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                     Mood Score
                  </span>
                  <Smile className="h-4 w-4 text-emerald-500" />
               </div>
               <div className="space-y-0.5">
                  <div className="text-3xl font-extrabold text-foreground">
                     4.5{" "}
                     <span className="text-sm font-semibold text-muted-foreground">
                        /5
                     </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold">
                     weekly reflection
                  </div>
               </div>
            </Card>
         </div>

         {/* Quote of the Day Section from Figma Screen 9 */}
         <div className="pt-6">
            <div className="text-center mb-6">
               <h2 className="text-lg font-bold text-foreground flex items-center justify-center gap-2">
                  <Quote className="h-4 w-4 text-primary" />
                  <span>Quote of the day</span>
               </h2>
            </div>

            <Card className="relative max-w-2xl mx-auto rounded-3xl border-border bg-card/60 backdrop-blur-xs p-8 md:p-12 shadow-sm text-center">
               {/* Left Decorative Quotation Mark */}
               <span className="absolute left-6 top-4 text-5xl font-serif text-muted-foreground/30 select-none">
                  “
               </span>

               <p className="text-base md:text-xl font-medium text-foreground leading-relaxed italic px-6">
                  It always seems impossible until it's done.
               </p>

               <div className="mt-4 font-bold text-sm text-primary tracking-wide">
                  — Nelson Mandela
               </div>

               {/* Right Decorative Quotation Mark */}
               <span className="absolute right-6 bottom-4 text-5xl font-serif text-muted-foreground/30 select-none">
                  ”
               </span>
            </Card>
         </div>

         {/* Account Info Card */}
         <Card className="max-w-2xl mx-auto rounded-2xl border-border bg-card p-6 shadow-2xs">
            <CardContent className="p-0 flex items-center gap-4">
               <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">
                  <UserIcon className="h-7 w-7" />
               </div>
               <div className="space-y-0.5">
                  <div className="text-lg font-bold text-foreground">
                     {fullName}
                  </div>
                  <div className="text-xs text-muted-foreground">{email}</div>
                  <div className="text-[11px] font-semibold text-primary pt-1">
                     Productivity Enthusiast • Member since May 2021
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
