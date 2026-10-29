import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
   Menu,
   Sun,
   Moon,
   Calendar as CalendarIcon,
   User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
   onOpenSidebar: () => void;
}

export const Header = ({ onOpenSidebar }: HeaderProps) => {
   const location = useLocation();
   const [isDark, setIsDark] = useState<boolean>(() => {
      if (typeof window !== "undefined") {
         return (
            document.documentElement.classList.contains("dark") ||
            localStorage.getItem("theme") === "dark"
         );
      }
      return false;
   });

   useEffect(() => {
      if (isDark) {
         document.documentElement.classList.add("dark");
         localStorage.setItem("theme", "dark");
      } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("theme", "light");
      }
   }, [isDark]);

   const getPageTitle = (pathname: string) => {
      switch (pathname) {
         case "/dashboard":
            return "Dashboard";
         case "/habits":
            return "My Habits";
         case "/archive":
            return "Archive / Trash";
         case "/profile":
            return "Profile & Settings";
         case "/action":
            return "Focus Timer (P1 Extension)";
         case "/labels":
            return "Habit Labels (P1 Extension)";
         default:
            return "Habit Tracker";
      }
   };

   const [todayFormatted] = useState(() => format(new Date(), "EEEE, MMM d"));

   return (
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 md:px-8 backdrop-blur-xs">
         <div className="flex items-center gap-3">
            <button
               onClick={onOpenSidebar}
               className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
               aria-label="Open sidebar"
            >
               <Menu className="h-5 w-5" />
            </button>
            <div>
               <h1 className="text-base md:text-lg font-bold tracking-tight text-foreground">
                  {getPageTitle(location.pathname)}
               </h1>
            </div>
         </div>

         <div className="flex items-center gap-3 md:gap-4">
            {/* Today's Date Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground shadow-2xs">
               <CalendarIcon className="h-3.5 w-3.5 text-primary" />
               <span>{todayFormatted}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
               onClick={() => setIsDark((prev) => !prev)}
               className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground shadow-2xs transition-colors"
               aria-label="Toggle theme"
            >
               {isDark ? (
                  <Sun className="h-4 w-4 text-amber-400" />
               ) : (
                  <Moon className="h-4 w-4" />
               )}
            </button>

            {/* Quick Profile Link */}
            <Link
               to="/profile"
               className="flex items-center gap-2 p-1.5 rounded-full border border-border bg-card hover:bg-accent transition-colors shadow-2xs"
            >
               <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  <UserIcon className="h-4 w-4" />
               </div>
            </Link>
         </div>
      </header>
   );
};
