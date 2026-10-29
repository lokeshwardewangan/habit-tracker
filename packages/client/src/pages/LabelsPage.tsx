import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

export const LabelsPage = () => {
   return (
      <div className="space-y-4">
         <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Habit Labels</h2>
            <Badge variant="outline">P1 Optional Extension</Badge>
         </div>
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Categories & Tags
               </CardTitle>
               <CardDescription>
                  This feature is marked as an optional extension (P1) in the
                  assignment requirements.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">
                  The primary habit lifecycle, daily checkoffs, and calendar
                  month views are active under My Habits.
               </p>
            </CardContent>
         </Card>
      </div>
   );
};
