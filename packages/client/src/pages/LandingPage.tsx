import { useState } from "react";
import { Link } from "react-router-dom";
import {
   Sparkles,
   ArrowRight,
   TrendingUp,
   Calendar as CalendarIcon,
   ShieldCheck,
   Flame,
   Check,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DemoHabit {
   id: string;
   name: string;
   streak: number;
   completed: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();

export const LandingPage = () => {
   const [demoHabits, setDemoHabits] = useState<DemoHabit[]>([
      {
         id: "1",
         name: "Morning Meditation (15 min)",
         streak: 12,
         completed: true,
      },
      {
         id: "2",
         name: "Read 20 pages of nonfiction",
         streak: 7,
         completed: false,
      },
      { id: "3", name: "Drink 2.5L of water", streak: 19, completed: true },
   ]);

   const toggleDemoHabit = (id: string) => {
      setDemoHabits((prev) =>
         prev.map((h) =>
            h.id === id
               ? {
                    ...h,
                    completed: !h.completed,
                    streak: !h.completed
                       ? h.streak + 1
                       : Math.max(0, h.streak - 1),
                 }
               : h,
         ),
      );
   };

   const completedCount = demoHabits.filter((h) => h.completed).length;
   const completionPercent = Math.round(
      (completedCount / demoHabits.length) * 100,
   );

   return (
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
         {/* Navigation Header */}
         <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
               <Link
                  to="/"
                  className="flex items-center gap-2.5 font-bold tracking-tight"
               >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                     <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-base font-bold">HabitFlow</span>
                     <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Tracker
                     </span>
                  </div>
               </Link>

               <div className="flex items-center gap-3">
                  <Link
                     to="/login"
                     className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                     )}
                  >
                     Sign In
                  </Link>
                  <Link
                     to="/signup"
                     className={cn(
                        buttonVariants({ variant: "default", size: "sm" }),
                     )}
                  >
                     Get Started
                  </Link>
               </div>
            </div>
         </header>

         {/* Hero Section */}
         <main className="flex-1">
            <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
               <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center text-center space-y-8">
                  {/* Tagline Badge */}
                  <Badge
                     variant="outline"
                     className="px-3.5 py-1 text-xs gap-1.5 shadow-2xs"
                  >
                     <Sparkles className="h-3.5 w-3.5 text-primary" />
                     <span>
                        Engineered for Consistency & Measurable Progress
                     </span>
                  </Badge>

                  {/* Main Headline */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15]">
                     Transform daily intentions into{" "}
                     <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        lifelong momentum
                     </span>
                     .
                  </h1>

                  {/* Subhead */}
                  <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                     A clean, distraction-free habit workspace. Track daily
                     routines, review calendar month histories, and monitor
                     dynamically calculated completion rates with zero fluff.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                     <Link
                        to="/signup"
                        className={cn(
                           buttonVariants({ variant: "default", size: "lg" }),
                           "w-full sm:w-auto gap-2 text-base px-6 shadow-xs",
                        )}
                     >
                        <span>Start Tracking Free</span>
                        <ArrowRight className="h-4 w-4" />
                     </Link>
                     <Link
                        to="/login"
                        className={cn(
                           buttonVariants({ variant: "outline", size: "lg" }),
                           "w-full sm:w-auto text-base px-6",
                        )}
                     >
                        Sign In to Your Workspace
                     </Link>
                  </div>

                  {/* Interactive Hero Teaser Card */}
                  <div className="w-full max-w-xl pt-8">
                     <div className="rounded-2xl border border-border bg-card p-6 shadow-md text-left space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                           <div>
                              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                 Interactive Live Preview
                              </div>
                              <div className="text-base font-bold text-foreground">
                                 Today's Habits
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                 {completionPercent}% completed
                              </span>
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                                 <div
                                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${completionPercent}%` }}
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Interactive Habit List */}
                        <div className="space-y-2.5">
                           {demoHabits.map((habit) => (
                              <div
                                 key={habit.id}
                                 onClick={() => toggleDemoHabit(habit.id)}
                                 className={cn(
                                    "flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                                    habit.completed
                                       ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                                       : "border-border bg-background hover:border-zinc-300 dark:hover:border-zinc-700",
                                 )}
                              >
                                 <div className="flex items-center gap-3">
                                    <div
                                       className={cn(
                                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                          habit.completed
                                             ? "bg-emerald-500 border-emerald-500 text-white"
                                             : "border-input bg-transparent",
                                       )}
                                    >
                                       {habit.completed && (
                                          <Check className="h-4 w-4 stroke-[3]" />
                                       )}
                                    </div>
                                    <span
                                       className={cn(
                                          "text-sm font-medium",
                                          habit.completed
                                             ? "line-through text-muted-foreground"
                                             : "text-foreground",
                                       )}
                                    >
                                       {habit.name}
                                    </span>
                                 </div>

                                 <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md">
                                    <Flame className="h-3.5 w-3.5 fill-amber-500" />
                                    <span>{habit.streak}d streak</span>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="text-center pt-2">
                           <span className="text-xs text-muted-foreground">
                              💡 Click habits above to test the instant checkoff
                              interaction.
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Features Grid */}
            <section className="border-t border-border bg-muted/30 py-20">
               <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
                  <div className="text-center space-y-3">
                     <h2 className="text-3xl font-bold tracking-tight">
                        Built on rigorous full-stack principles
                     </h2>
                     <p className="max-w-xl mx-auto text-muted-foreground text-sm">
                        Everything you need to build steady routines, without
                        the clutter of social networks or unnecessary upsells.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Card>
                        <CardHeader>
                           <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                              <TrendingUp className="h-5 w-5" />
                           </div>
                           <CardTitle>Dynamic Statistics</CardTitle>
                           <CardDescription>
                              Calculations derived directly from real database
                              checkoffs. Completion rates reflect active habit
                              start dates without arbitrary hardcoded figures.
                           </CardDescription>
                        </CardHeader>
                     </Card>

                     <Card>
                        <CardHeader>
                           <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                              <CalendarIcon className="h-5 w-5" />
                           </div>
                           <CardTitle>Calendar Month History</CardTitle>
                           <CardDescription>
                              Clear visual month grids in strict calendar date
                              format (
                              <code className="text-xs font-mono">
                                 YYYY-MM-DD
                              </code>
                              ). Click any past date to toggle completion or
                              undo.
                           </CardDescription>
                        </CardHeader>
                     </Card>

                     <Card>
                        <CardHeader>
                           <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                              <ShieldCheck className="h-5 w-5" />
                           </div>
                           <CardTitle>Tenant Isolation & Privacy</CardTitle>
                           <CardDescription>
                              Strict server-side data ownership enforcement.
                              Passwords are never stored in plain text, and ID
                              tampering attempts are safely blocked.
                           </CardDescription>
                        </CardHeader>
                     </Card>
                  </div>
               </div>
            </section>

            {/* Call to Action Banner */}
            <section className="py-20 border-t border-border">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                     Ready to build consistency that lasts?
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
                     Sign up in seconds, configure your first routine, and track
                     your daily progress with confidence.
                  </p>
                  <Link
                     to="/signup"
                     className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "gap-2 px-8 shadow-xs",
                     )}
                  >
                     <span>Get Started Now</span>
                     <ArrowRight className="h-4 w-4" />
                  </Link>
               </div>
            </section>
         </main>

         {/* Footer */}
         <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  © {CURRENT_YEAR} HabitFlow. Take-Home Developer Assignment.
               </div>
               <div className="flex gap-4">
                  <Link to="/login" className="hover:underline">
                     Sign In
                  </Link>
                  <Link to="/signup" className="hover:underline">
                     Sign Up
                  </Link>
               </div>
            </div>
         </footer>
      </div>
   );
};
