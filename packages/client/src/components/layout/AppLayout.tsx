import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { NewHabitModal } from "@/components/habits/NewHabitModal";

export const AppLayout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   return (
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
         {/* Sidebar */}
         <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
         />

         {/* Main Content Area */}
         <div className="flex flex-1 flex-col overflow-hidden">
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
            onCreate={() => {
               // When connected, will invalidate queries or push to state
               setIsCreateModalOpen(false);
            }}
         />
      </div>
   );
};
