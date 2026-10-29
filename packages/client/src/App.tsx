import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card shadow-xs text-center space-y-4">
               <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                  ⚡
               </div>
               <h1 className="text-2xl font-bold tracking-tight">
                  Habit Tracker
               </h1>
               <p className="text-sm text-muted-foreground">
                  Frontend infrastructure, Vite proxy, TanStack Query, and Axios
                  client initialized successfully.
               </p>
            </div>
         </div>
         <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
   );
}

export default App;
