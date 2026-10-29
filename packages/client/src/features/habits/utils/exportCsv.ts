import type { Habit } from "@/types/api";
import { format } from "date-fns";

export const exportHabitsToCsv = (habits: Habit[]) => {
   if (!habits || habits.length === 0) {
      return;
   }

   const headers = [
      "ID",
      "Name",
      "Frequency",
      "Start Date",
      "Status",
      "Created At",
   ];
   const rows = habits.map((h) => [
      `"${h.id}"`,
      `"${h.name.replace(/"/g, '""')}"`,
      `"${h.frequency}"`,
      `"${h.startDate}"`,
      `"${h.status}"`,
      `"${h.createdAt}"`,
   ]);

   const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n",
   );
   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.setAttribute("href", url);
   link.setAttribute(
      "download",
      `habit-tracker-export-${format(new Date(), "yyyy-MM-dd")}.csv`,
   );
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(url);
};
