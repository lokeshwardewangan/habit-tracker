import { useState, useEffect, useCallback } from "react";
import type { HabitLabel } from "@/types/habit";

export const DEFAULT_LABELS: HabitLabel[] = [
   { id: "lbl-1", name: "Daily Routine", count: 0 },
   { id: "lbl-2", name: "Health & Fitness", count: 0 },
   { id: "lbl-3", name: "Deep Work", count: 0 },
   { id: "lbl-4", name: "Mindfulness", count: 0 },
];

const STORAGE_KEY = "habitpulse_custom_labels";
const SYNC_EVENT = "habitpulse:labels_updated";

const getStoredLabels = (): HabitLabel[] => {
   try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         const parsed = JSON.parse(saved);
         if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
   } catch {
      // ignore JSON parse error
   }
   return DEFAULT_LABELS;
};

const persistLabels = (labels: HabitLabel[]) => {
   try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
      window.dispatchEvent(new Event(SYNC_EVENT));
   } catch {
      // ignore storage error
   }
};

export const useLabels = () => {
   const [labels, setLabels] = useState<HabitLabel[]>(getStoredLabels);

   useEffect(() => {
      const handleSync = () => {
         setLabels(getStoredLabels());
      };

      window.addEventListener(SYNC_EVENT, handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
         window.removeEventListener(SYNC_EVENT, handleSync);
         window.removeEventListener("storage", handleSync);
      };
   }, []);

   const addLabel = useCallback((name: string): HabitLabel | null => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const current = getStoredLabels();
      if (current.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
         return null;
      }

      const newLabel: HabitLabel = {
         id: `lbl-${Date.now()}`,
         name: trimmed,
         count: 0,
      };

      const updated = [...current, newLabel];
      persistLabels(updated);
      setLabels(updated);
      return newLabel;
   }, []);

   const updateLabel = useCallback((id: string, newName: string): boolean => {
      const trimmed = newName.trim();
      if (!trimmed) return false;

      const current = getStoredLabels();
      const updated = current.map((l) =>
         l.id === id ? { ...l, name: trimmed } : l,
      );
      persistLabels(updated);
      setLabels(updated);
      return true;
   }, []);

   const deleteLabel = useCallback((id: string) => {
      const current = getStoredLabels();
      const updated = current.filter((l) => l.id !== id);
      persistLabels(updated);
      setLabels(updated);
   }, []);

   const availableLabels = labels.map((l) => l.name);

   return {
      labels,
      setLabels,
      availableLabels,
      addLabel,
      updateLabel,
      deleteLabel,
   };
};
