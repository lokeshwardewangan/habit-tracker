import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";

export const ArchivePage = () => {
   return (
      <div className="space-y-4">
         <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">
               Archive / Trash
            </h2>
            <p className="text-sm text-muted-foreground">
               View archived habits and manage restoration or permanent
               deletion.
            </p>
         </div>
         <Card>
            <CardHeader>
               <CardTitle>Archived Habits</CardTitle>
               <CardDescription>
                  Habits in archive retain all historical completions.
               </CardDescription>
            </CardHeader>
         </Card>
      </div>
   );
};
