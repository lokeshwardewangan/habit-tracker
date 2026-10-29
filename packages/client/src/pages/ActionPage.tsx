import { useState, useEffect } from "react";
import {
   Play,
   Pause,
   RotateCcw,
   Timer,
   Zap,
   Coffee,
   CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const ActionPage = () => {
   const [mode, setMode] = useState<"focus" | "break">("focus");
   const [timeLeft, setTimeLeft] = useState(25 * 60);
   const [isRunning, setIsRunning] = useState(false);
   const [sessionsCompleted, setSessionsCompleted] = useState(0);

   useEffect(() => {
      if (!isRunning) return;

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 1) {
               setIsRunning(false);
               if (mode === "focus") {
                  setSessionsCompleted((count) => count + 1);
                  toast.success(
                     "Focus session finished! Time for a short break.",
                  );
                  setMode("break");
                  return 5 * 60;
               } else {
                  toast.success("Break completed! Ready to focus again?");
                  setMode("focus");
                  return 25 * 60;
               }
            }
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(interval);
   }, [isRunning, mode]);

   const togglePlay = () => setIsRunning((prev) => !prev);

   const resetTimer = () => {
      setIsRunning(false);
      setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
   };

   const switchMode = (newMode: "focus" | "break") => {
      setIsRunning(false);
      setMode(newMode);
      setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
   };

   const minutes = Math.floor(timeLeft / 60);
   const seconds = timeLeft % 60;
   const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

   const totalDuration = mode === "focus" ? 25 * 60 : 5 * 60;
   const progressPercent = Math.round(
      ((totalDuration - timeLeft) / totalDuration) * 100,
   );

   return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-50 duration-200">
         {/* Top Header */}
         <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
               <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                  <Timer className="h-6 w-6 text-primary" />
                  <span>Pomodoro Focus Timer</span>
               </h1>
               <p className="text-xs text-muted-foreground mt-0.5">
                  Deep work and habit focus intervals (P1 Extension)
               </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
               <Zap className="h-3.5 w-3.5 fill-current" />
               <span>{sessionsCompleted} sessions done</span>
            </div>
         </div>

         {/* Mode Switcher Tabs */}
         <div className="flex justify-center">
            <div className="p-1 rounded-2xl bg-muted/70 border border-border flex items-center gap-1">
               <button
                  type="button"
                  onClick={() => switchMode("focus")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                     mode === "focus"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                  }`}
               >
                  <Timer className="h-4 w-4" />
                  <span>Focus (25m)</span>
               </button>

               <button
                  type="button"
                  onClick={() => switchMode("break")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                     mode === "break"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                  }`}
               >
                  <Coffee className="h-4 w-4" />
                  <span>Short Break (5m)</span>
               </button>
            </div>
         </div>

         {/* Timer Card */}
         <Card className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm text-center space-y-8">
            <div className="space-y-4">
               {/* Big Countdown Display */}
               <div className="text-7xl sm:text-8xl font-black tracking-tight font-mono text-foreground select-none">
                  {formattedTime}
               </div>

               {/* Progress bar */}
               <div className="max-w-md mx-auto h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                     className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
                     style={{ width: `${progressPercent}%` }}
                  />
               </div>
               <p className="text-xs text-muted-foreground font-semibold">
                  {mode === "focus"
                     ? "Stay engaged with your routine"
                     : "Relax and recharge"}
               </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">
               <Button
                  onClick={togglePlay}
                  size="lg"
                  className={`h-14 px-8 rounded-2xl font-bold text-base shadow-sm cursor-pointer transition-transform active:scale-95 flex items-center gap-2.5 ${
                     isRunning
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
               >
                  {isRunning ? (
                     <>
                        <Pause className="h-5 w-5 fill-current" />
                        <span>Pause</span>
                     </>
                  ) : (
                     <>
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                        <span>Start Session</span>
                     </>
                  )}
               </Button>

               <Button
                  variant="outline"
                  onClick={resetTimer}
                  size="lg"
                  className="h-14 px-5 rounded-2xl border-border text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset Timer"
               >
                  <RotateCcw className="h-5 w-5" />
               </Button>
            </div>
         </Card>

         {/* Focus Tips Card */}
         <Card className="rounded-2xl border-border bg-card p-5 shadow-2xs">
            <CardContent className="p-0 flex items-start gap-3">
               <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
               </div>
               <div className="space-y-0.5 text-xs text-muted-foreground">
                  <p className="font-bold text-foreground">
                     Habit Stacking Tip
                  </p>
                  <p>
                     Pair this 25-minute Pomodoro session with your scheduled
                     daily habits (e.g., Reading 20 pages or Deep Work) to build
                     unbreakable discipline.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
