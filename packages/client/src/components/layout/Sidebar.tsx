import { NavLink, Link, useNavigate } from "react-router-dom";
import { Plus, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { NAV_ITEMS } from "@/constants/navigation";

interface SidebarProps {
   isOpen?: boolean;
   onClose?: () => void;
   onOpenCreateModal: () => void;
}

export const Sidebar = ({
   isOpen,
   onClose,
   onOpenCreateModal,
}: SidebarProps) => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const displayName = user
      ? `${user.firstName} ${user.lastName}`
      : "Tanay Pratap";
   const initials = user
      ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
        "U"
      : "TP";

   const handleLogout = async () => {
      await logout();
      toast.success("Signed out successfully");
      navigate("/login");
   };
   const navItems = NAV_ITEMS;

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
            {/* Top Logo / Brand */}
            <div className="flex h-20 items-center justify-between px-6">
               <Link to="/home" className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-primary">
                     MyWebsite
                  </span>
               </Link>
               {onClose && (
                  <button
                     onClick={onClose}
                     className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent md:hidden"
                     aria-label="Close menu"
                  >
                     <X className="h-5 w-5" />
                  </button>
               )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 px-4 py-2 space-y-6">
               <nav className="space-y-1.5">
                  {navItems.map((item) => (
                     <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                           `flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                              isActive
                                 ? "bg-primary/10 text-primary font-bold shadow-2xs"
                                 : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                           }`
                        }
                     >
                        <item.icon className="h-5 w-5 shrink-0 stroke-[2.2]" />
                        <span>{item.name}</span>
                     </NavLink>
                  ))}
               </nav>

               {/* Primary Create Button */}
               <div className="pt-2 px-1">
                  <Button
                     onClick={onOpenCreateModal}
                     className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                     <Plus className="h-4 w-4 stroke-[3]" />
                     <span>Create New Habit</span>
                  </Button>
               </div>
            </div>

            {/* Bottom Profile User Card */}
            <div className="p-4 border-t border-border">
               <div className="flex items-center justify-between p-2 rounded-xl hover:bg-sidebar-accent/60 transition-colors">
                  <Link
                     to="/profile"
                     className="flex items-center gap-3 min-w-0"
                  >
                     <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0 border border-primary/20">
                        {initials}
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate text-foreground">
                           {displayName}
                        </span>
                        <span className="text-xs text-primary font-medium hover:underline">
                           View Profile
                        </span>
                     </div>
                  </Link>

                  <button
                     type="button"
                     onClick={handleLogout}
                     className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                     title="Sign Out"
                  >
                     <LogOut className="h-4 w-4" />
                  </button>
               </div>
            </div>
         </aside>
      </>
   );
};
