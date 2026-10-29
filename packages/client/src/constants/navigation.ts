import {
   Home as HomeIcon,
   Tag,
   Archive as ArchiveIcon,
   Trash2,
   Timer,
} from "lucide-react";

export const NAV_ITEMS = [
   {
      name: "Home",
      path: "/home",
      icon: HomeIcon,
   },
   {
      name: "Focus Timer",
      path: "/timer",
      icon: Timer,
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
