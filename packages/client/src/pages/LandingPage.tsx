import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Flame } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LandingPage = () => {
   const [demoHabits, setDemoHabits] = useState([
      {
         id: "1",
         title: "Morning walk & sunlight (20 mins)",
         streak: 14,
         completed: true,
         tag: "Health",
      },
      {
         id: "2",
         title: "Read 15 pages of nonfiction",
         streak: 6,
         completed: true,
         tag: "Learning",
      },
      {
         id: "3",
         title: "Drink 2.5L water",
         streak: 21,
         completed: false,
         tag: "Health",
      },
      {
         id: "4",
         title: "Review tomorrow's priorities",
         streak: 4,
         completed: false,
         tag: "Focus",
      },
   ]);

   const toggleDemo = (id: string) => {
      setDemoHabits((prev) =>
         prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
      );
   };

   const completedCount = demoHabits.filter((h) => h.completed).length;

   return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
         {/* Simple, Clean Navbar */}
         <header className="border-b border-border/80 bg-background/90 backdrop-blur-xs sticky top-0 z-30">
            <div className="max-w-5xl mx-auto h-16 px-6 flex items-center justify-between">
               <Link to="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs">
                     <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <span className="text-lg font-black tracking-tight text-foreground">
                     HabitPulse
                  </span>
               </Link>

               <div className="flex items-center gap-3">
                  <Link
                     to="/login"
                     className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "text-sm font-semibold",
                     )}
                  >
                     Sign in
                  </Link>
                  <Link
                     to="/signup"
                     className={cn(
                        buttonVariants({ variant: "default", size: "sm" }),
                        "rounded-xl px-4 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs text-sm",
                     )}
                  >
                     Get Started
                  </Link>
               </div>
            </div>
         </header>

         {/* Human-made Hero Section */}
         <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
               {/* Minimal badge */}
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Simple daily habit tracking</span>
               </div>

               {/* Headline: Clean, human, punchy */}
               <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
                  Small daily habits. <br />
                  <span className="text-primary">Measurable progress.</span>
               </h1>

               {/* Subtitle */}
               <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  No gamified clutter or complex setup. Just a fast,
                  distraction-free space to build daily routines and keep your
                  streaks alive.
               </p>

               {/* CTA Buttons */}
               <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                     to="/signup"
                     className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "w-full sm:w-auto h-12 px-7 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.02]",
                     )}
                  >
                     <span>Start tracking free</span>
                     <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                     to="/home"
                     className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full sm:w-auto h-12 px-6 rounded-xl font-semibold border-border bg-card hover:bg-accent text-sm",
                     )}
                  >
                     View live demo
                  </Link>
               </div>
            </div>

            {/* Clean App Preview Mockup Window (Human, not AI template) */}
            <div className="w-full max-w-2xl mt-14">
               <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden text-left">
                  {/* Window Bar */}
                  <div className="h-10 px-4 bg-muted/40 border-b border-border flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                     </div>
                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Today's Focus • {completedCount}/{demoHabits.length}{" "}
                        Done
                     </span>
                     <div className="w-8" />
                  </div>

                  {/* Habit List */}
                  <div className="p-4 sm:p-5 space-y-2.5 bg-background/50">
                     {demoHabits.map((habit) => (
                        <div
                           key={habit.id}
                           onClick={() => toggleDemo(habit.id)}
                           className={cn(
                              "flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                              habit.completed
                                 ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                                 : "bg-card border-border hover:border-border/80 hover:bg-accent/40",
                           )}
                        >
                           <div className="flex items-center gap-3 min-w-0">
                              <div
                                 className={cn(
                                    "h-6 w-6 rounded-lg border flex items-center justify-center transition-colors shrink-0",
                                    habit.completed
                                       ? "bg-emerald-500 border-emerald-500 text-white"
                                       : "border-input bg-transparent",
                                 )}
                              >
                                 {habit.completed && (
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                 )}
                              </div>
                              <span
                                 className={cn(
                                    "text-sm font-semibold truncate",
                                    habit.completed
                                       ? "line-through text-muted-foreground"
                                       : "text-foreground",
                                 )}
                              >
                                 {habit.title}
                              </span>
                           </div>

                           <div className="flex items-center gap-2 shrink-0 pl-2">
                              <span className="hidden sm:inline text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                 {habit.tag}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                 <Flame className="h-3 w-3 fill-amber-500" />
                                 <span>{habit.streak}d</span>
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Bottom helper */}
                  <div className="px-4 py-2.5 bg-muted/20 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                     <span>Click any habit to test the instant checkoff</span>
                     <span className="font-semibold text-primary">
                        Saved locally
                     </span>
                  </div>
               </div>
            </div>
         </main>

         {/* Minimal Footer */}
         <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
            <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
               <div>Built with React, TypeScript & Tailwind CSS</div>
               <div className="flex gap-4">
                  <Link
                     to="/home"
                     className="hover:text-foreground transition-colors"
                  >
                     Open App
                  </Link>
                  <Link
                     to="/login"
                     className="hover:text-foreground transition-colors"
                  >
                     Sign in
                  </Link>
                  <Link
                     to="/signup"
                     className="hover:text-foreground transition-colors"
                  >
                     Sign up
                  </Link>
               </div>
            </div>
         </footer>
      </div>
   );
};
