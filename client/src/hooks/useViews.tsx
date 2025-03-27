// src/hooks/useViews.tsx
import { useState } from "react";
import { View } from "@/types";

// Optional initial views to load
interface UseViewsOptions {
  initialViews?: View[];
}

export function useViews({ initialViews = [] }: UseViewsOptions = {}) {
  const [views, setViews] = useState<View[]>(initialViews);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);

  // Create a new view
  const createView = (title: string, description: string, snapshot: any) => {
    const newView: View = {
      id: `view-${Date.now()}`,
      title: title || `View ${views.length + 1}`,
      description: description || "No description provided",
      mvsj: snapshot,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setViews((prev) => [...prev, newView]);
    return newView;
  };

  // Update an existing view
  const updateView = (viewId: string, updates: Partial<View>) => {
    setViews((prev) =>
      prev.map((view) =>
        view.id === viewId
          ? {
              ...view,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : view,
      ),
    );
  };

  // Delete a view
  const deleteView = (viewId: string) => {
    setViews((prev) => prev.filter((view) => view.id !== viewId));
    if (currentViewId === viewId) {
      setCurrentViewId(null);
    }
  };

  // Set the current active view
  const setCurrentView = (viewId: string | null) => {
    setCurrentViewId(viewId);
  };

  // Get a view by ID
  const getViewById = (viewId: string) => {
    return views.find((view) => view.id === viewId) || null;
  };

  return {
    views,
    currentViewId,
    createView,
    updateView,
    deleteView,
    setCurrentView,
    getViewById,
  };
}
