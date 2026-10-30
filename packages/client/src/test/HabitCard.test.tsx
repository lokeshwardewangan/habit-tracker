import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HabitCard } from "../components/habits/HabitCard";
import type { HabitItem } from "../types/habit";

const mockHabit: HabitItem = {
   id: "habit-1",
   title: "Morning 5km Run",
   startDate: "2026-10-30",
   endDate: "2026-10-30",
   goalTimes: 1,
   currentTimes: 0,
   repeat: "Daily",
   colour: "blue",
   status: "Active",
   labels: ["Fitness", "Morning"],
   streak: 5,
};

describe("HabitCard component", () => {
   it("renders habit title, labels, and goal count accurately", () => {
      render(<HabitCard habit={mockHabit} mode="home" />);

      expect(screen.getByText("Morning 5km Run")).toBeInTheDocument();
      expect(screen.getByText("Fitness")).toBeInTheDocument();
      expect(screen.getByText("Morning")).toBeInTheDocument();
      expect(screen.getByText(/0\/1 times today/i)).toBeInTheDocument();
   });

   it("triggers onToggleComplete when checkmark button is clicked in home mode", () => {
      const handleToggle = vi.fn();
      render(
         <HabitCard
            habit={mockHabit}
            mode="home"
            onToggleComplete={handleToggle}
         />,
      );

      const checkmarkButton = screen.getByLabelText("Mark as completed");
      fireEvent.click(checkmarkButton);

      expect(handleToggle).toHaveBeenCalledWith("habit-1");
   });

   it("renders restore action in archive mode and triggers onRestore", () => {
      const handleRestore = vi.fn();
      render(
         <HabitCard
            habit={{ ...mockHabit, status: "Archived" }}
            mode="archive"
            onRestore={handleRestore}
         />,
      );

      const restoreButton = screen.getByLabelText("Restore Habit");
      fireEvent.click(restoreButton);

      expect(handleRestore).toHaveBeenCalledWith("habit-1");
   });

   it("renders permanent delete action in trash mode and triggers onDeletePermanent", () => {
      const handleDelete = vi.fn();
      render(
         <HabitCard
            habit={{ ...mockHabit, status: "Trash" }}
            mode="trash"
            onDeletePermanent={handleDelete}
         />,
      );

      const deleteButton = screen.getByLabelText("Permanently Delete");
      fireEvent.click(deleteButton);

      expect(handleDelete).toHaveBeenCalledWith("habit-1");
   });
});
