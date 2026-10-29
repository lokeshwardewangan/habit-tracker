import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppLayout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   return (
      <div className="flex h-screen w-full bg-background overflow-hidden">
         {/* Sidebar */}
         <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
         />

         {/* Main Content Area */}
         <div className="flex flex-1 flex-col overflow-hidden">
            <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
               <div className="mx-auto max-w-6xl space-y-8">
                  <Outlet />
               </div>
            </main>
         </div>
      </div>
   );
};
