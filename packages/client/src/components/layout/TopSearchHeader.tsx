import { Search, SlidersHorizontal, Menu } from "lucide-react";

interface TopSearchHeaderProps {
   searchQuery?: string;
   onSearchChange?: (val: string) => void;
   placeholder?: string;
   onOpenSidebar?: () => void;
}

export const TopSearchHeader = ({
   searchQuery = "",
   onSearchChange,
   placeholder = "Search Posts, People, anything...",
   onOpenSidebar,
}: TopSearchHeaderProps) => {
   return (
      <div className="flex items-center gap-3 w-full max-w-xl mx-auto mb-6">
         {onOpenSidebar && (
            <button
               onClick={onOpenSidebar}
               className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground md:hidden shrink-0 shadow-2xs"
               aria-label="Open sidebar menu"
            >
               <Menu className="h-5 w-5" />
            </button>
         )}

         <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => onSearchChange?.(e.target.value)}
               placeholder={placeholder}
               className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground shadow-2xs transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
               type="button"
               className="absolute right-3 p-1 text-muted-foreground hover:text-foreground"
               title="Filter"
            >
               <SlidersHorizontal className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};
