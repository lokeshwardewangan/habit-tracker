export const DashboardPage = () => {
   return (
      <div className="space-y-4">
         <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">
               Dashboard Overview
            </h2>
            <p className="text-sm text-muted-foreground">
               Track your daily progress and habit completion metrics in real
               time.
            </p>
         </div>
         <div className="p-8 rounded-2xl border border-dashed border-border bg-card/50 text-center text-muted-foreground">
            Dashboard content & dynamic stats loading skeleton...
         </div>
      </div>
   );
};
