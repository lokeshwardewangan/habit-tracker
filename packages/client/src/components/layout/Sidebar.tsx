import { NavLink } from "react-router-dom";
import {
   LayoutDashboard,
   CheckSquare,
   Archive,
   User,
   Timer,
   Tag,
   Sparkles,
   X,
} from "lucide-react";

interface SidebarProps {
   isOpen?: boolean;
   onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
   const mainNavItems = [
      {
         name: "Dashboard",
         path: "/dashboard",
         icon: LayoutDashboard,
      },
      {
         name: "My Habits",
         path: "/habits",
         icon: CheckSquare,
      },
      {
         name: "Archive",
         path: "/archive",
         icon: Archive,
      },
      {
         name: "Profile",
         path: "/profile",
         icon: User,
      },
   ];

   const figmaExtraItems = [
      {
         name: "Focus Timer",
         path: "/action",
         icon: Timer,
         badge: "P1",
      },
      {
         name: "Labels",
         path: "/labels",
         icon: Tag,
         badge: "P1",
      },
   ];

   return (
      <>
         {/* Mobile overlay */}
         {isOpen && (
            <div
               className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs md:hidden"
               onClick={onClose}
            />
         )}

         <aside
            className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
               isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
         >
            {/* Brand Logo Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
               <NavLink
                  to="/dashboard"
                  className="flex items-center gap-2.5 font-semibold text-sidebar-foreground"
               >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                     <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-base font-bold tracking-tight">
                        HabitFlow
                     </span>
                     <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Tracker
                     </span>
                  </div>
               </NavLink>
               {onClose && (
                  <button
                     onClick={onClose}
                     className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
                     aria-label="Close menu"
                  >
                     <X className="h-5 w-5" />
                  </button>
               )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
               <div>
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                     Core Navigation
                  </div>
                  <nav className="space-y-1">
                     {mainNavItems.map((item) => (
                        <NavLink
                           key={item.path}
                           to={item.path}
                           onClick={onClose}
                           className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                 isActive
                                    ? "bg-sidebar-accent text-sidebar-foreground font-semibold shadow-xs"
                                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              }`
                           }
                        >
                           <item.icon className="h-4 w-4 shrink-0" />
                           <span>{item.name}</span>
                        </NavLink>
                     ))}
                  </nav>
               </div>

               <div>
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                     Extensions (Figma)
                  </div>
                  <nav className="space-y-1">
                     {figmaExtraItems.map((item) => (
                        <NavLink
                           key={item.path}
                           to={item.path}
                           onClick={onClose}
                           className={({ isActive }) =>
                              `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                 isActive
                                    ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              }`
                           }
                        >
                           <div className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span>{item.name}</span>
                           </div>
                           <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                              {item.badge}
                           </span>
                        </NavLink>
                     ))}
                  </nav>
               </div>
            </div>

            {/* Footer Workspace Info */}
            <div className="p-4 border-t border-sidebar-border">
               <div className="rounded-xl border border-border bg-card p-3 shadow-xs text-xs space-y-1">
                  <div className="font-semibold text-foreground">
                     Personal Habit Suite
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                     Dynamic stats & history engine
                  </div>
               </div>
            </div>
         </aside>
      </>
   );
};
