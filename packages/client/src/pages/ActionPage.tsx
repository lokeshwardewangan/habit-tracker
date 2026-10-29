import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";

export const ActionPage = () => {
   return (
      <div className="space-y-4">
         <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Focus Timer</h2>
            <Badge variant="outline">P1 Optional Extension</Badge>
         </div>
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Pomodoro & Habit Sessions
               </CardTitle>
               <CardDescription>
                  This feature is marked as an optional extension (P1) in the
                  assignment requirements.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">
                  The core habit management, completion tracking, and dynamic
                  dashboard statistics are fully available in the main views.
               </p>
            </CardContent>
         </Card>
      </div>
   );
};
