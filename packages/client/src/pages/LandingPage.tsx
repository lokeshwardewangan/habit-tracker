import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LandingPage = () => {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
         <h1 className="text-4xl font-extrabold tracking-tight">
            Build Better Habits, Daily.
         </h1>
         <p className="max-w-md text-muted-foreground">
            A minimalist, high-performance personal habit tracker built for
            daily consistency.
         </p>
         <div className="flex gap-4">
            <Link
               to="/signup"
               className={cn(buttonVariants({ variant: "default" }))}
            >
               Get Started
            </Link>
            <Link
               to="/login"
               className={cn(buttonVariants({ variant: "outline" }))}
            >
               Sign In
            </Link>
         </div>
      </div>
   );
};
