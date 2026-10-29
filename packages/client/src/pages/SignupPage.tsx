import { Link } from "react-router-dom";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SignupPage = () => {
   return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle>Create an account</CardTitle>
               <CardDescription>
                  Start tracking your daily routines and build streaks.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-muted-foreground">
                  Signup form will be wired up in Task 4.
               </p>
               <Link
                  to="/dashboard"
                  className={cn(
                     buttonVariants({ variant: "default" }),
                     "w-full",
                  )}
               >
                  Go to Dashboard (Temporary)
               </Link>
            </CardContent>
         </Card>
      </div>
   );
};
