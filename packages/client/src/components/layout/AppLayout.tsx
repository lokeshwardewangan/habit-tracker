import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { NewHabitModal } from "@/components/habits/NewHabitModal";
import { Button } from "@/components/ui/button";
import { useCreateHabit } from "@/hooks/useHabits";
import { format } from "date-fns";
import { ActionTooltip } from "@/components/ui/tooltip";

export const AppLayout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const createHabit = useCreateHabit();

   return (
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
         {/* Sidebar */}
         <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
         />

         {/* Main Content Area */}
         <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            {/* Mobile Header (visible only on md:hidden) */}
            <header className="flex md:hidden h-14 items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur-xs sticky top-0 z-30 shrink-0">
               <div className="flex items-center gap-2">
                  <ActionTooltip content="Open navigation menu">
                     <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-1 rounded-xl text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                        aria-label="Open navigation menu"
                     >
                        <Menu className="h-5 w-5" />
                     </button>
                  </ActionTooltip>
                  <Link
                     to="/home"
                     className="flex items-center gap-2 font-black text-xl tracking-tight text-primary"
                  >
                     HabitPulse
                  </Link>
               </div>

               <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="h-8 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow-2xs cursor-pointer"
               >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" />
                  <span>New Habit</span>
               </Button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:px-10">
               <div className="mx-auto max-w-6xl">
                  <Outlet />
               </div>
            </main>
         </div>

         {/* Global New Habit Modal */}
         <NewHabitModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={async (habit) => {
               await createHabit.mutateAsync({
                  name: habit.title,
                  startDate: format(new Date(), "yyyy-MM-dd"),
                  frequency: habit.repeat === "Weekly" ? "WEEKLY" : "DAILY",
                  labels: habit.labels,
               });
               setIsCreateModalOpen(false);
            }}
         />
      </div>
   );
};
