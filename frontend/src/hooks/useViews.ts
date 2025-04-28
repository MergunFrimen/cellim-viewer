// src/hooks/useViews.tsx
import { useMolstar } from "@/contexts/MolstarProvider";
import { UUID } from "molstar/lib/commonjs/mol-util";
import { useEffect, useState } from "react";

export interface View {
  id: string;
  name: string;
  description: string;
  mvsj: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  screenshot?: string;
}
// Optional initial views to load and callback when views change
interface UseViewsOptions {
  initialViews?: View[];
  onViewsChange?: () => void;
}

export function useViews({
  initialViews = [],
  onViewsChange,
}: UseViewsOptions = {}) {
  const { viewer } = useMolstar();
  const [views, setViews] = useState<View[]>(initialViews);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);
  const [screenshotUrls, setScreenshotUrls] = useState<Record<string, string>>(
    {},
  );

  // Update views when initialViews changes (e.g., from API)
  useEffect(() => {
    if (initialViews.length > 0) {
      setViews(initialViews);
    }
  }, [initialViews]);

  // Call onViewsChange whenever views are updated
  useEffect(() => {
    if (onViewsChange) {
      onViewsChange();
    }
  }, [views, onViewsChange]);

  // Create a new view
  const createView = async (
    id: string,
    name: string,
    description: string,
    snapshot: any,
  ) => {
    // Take a screenshot before creating the view
    let screenshotUrl = "";
    try {
      screenshotUrl = await viewer.screenshot();
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }

    const newView: View = {
      id: id || UUID.createv4(),
      name: name || `View ${views.length + 1}`,
      description: description || "No description provided",
      mvsj: snapshot,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    setViews((prev) => [...prev, newView]);

    // Store the screenshot URL
    if (screenshotUrl) {
      setScreenshotUrls((prev) => ({
        ...prev,
        [newView.id]: screenshotUrl,
      }));
    }

    return newView;
  };

  // Update an existing view
  const updateView = (viewId: string, updates: Partial<View>) => {
    // If the update includes a screenshot, store it
    if (updates.screenshot) {
      setScreenshotUrls((prev) => ({
        ...prev,
        [viewId]: updates.screenshot as string,
      }));
      delete updates.screenshot; // Remove screenshot from updates as it's not part of the View type
    }

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

    // Also remove the screenshot
    setScreenshotUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[viewId];
      return newUrls;
    });

    if (currentViewId === viewId) {
      setCurrentViewId(null);
    }
  };

  // Reorder views
  const reorderViews = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;

    setViews((prevViews) => {
      const result = Array.from(prevViews);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
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
    screenshotUrls,
    createView,
    updateView,
    deleteView,
    reorderViews,
    setCurrentView,
    getViewById,
  };
}
