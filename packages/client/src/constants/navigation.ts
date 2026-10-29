import {
   Home as HomeIcon,
   Tag,
   Archive as ArchiveIcon,
   Trash2,
} from "lucide-react";

export const NAV_ITEMS = [
   {
      name: "Home",
      path: "/home",
      icon: HomeIcon,
   },
   {
      name: "Labels",
      path: "/labels",
      icon: Tag,
   },
   {
      name: "Archive",
      path: "/archive",
      icon: ArchiveIcon,
   },
   {
      name: "Trash",
      path: "/trash",
      icon: Trash2,
   },
] as const;
