import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";

export const ProfilePage = () => {
   return (
      <div className="space-y-4">
         <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">
               Profile & Account
            </h2>
            <p className="text-sm text-muted-foreground">
               Manage your personal account credentials and preferences.
            </p>
         </div>
         <Card>
            <CardHeader>
               <CardTitle>User Profile</CardTitle>
               <CardDescription>
                  Authentication session and account details.
               </CardDescription>
            </CardHeader>
         </Card>
      </div>
   );
};
