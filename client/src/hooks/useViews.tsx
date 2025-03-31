// src/hooks/useViews.tsx
import { useState } from "react";
import { View } from "@/types";
import { useMolstar } from "@/context/MolstarContext";

// Optional initial views to load
interface UseViewsOptions {
  initialViews?: View[];
}

export function useViews({ initialViews = [] }: UseViewsOptions = {}) {
  const { viewer } = useMolstar();
  const [views, setViews] = useState<View[]>(initialViews);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);
  const [screenshotUrls, setScreenshotUrls] = useState<Record<string, string>>(
    {},
  );

  // Create a new view
  const createView = async (
    title: string,
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
      id: `view-${Date.now()}`,
      name: title || `View ${views.length + 1}`,
      description: description || "No description provided",
      mvsj: snapshot,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  // Generate screenshots for all views without one
  const generateMissingScreenshots = async () => {
    // This is a utility function that could be called when all views are loaded
    // It would ensure every view has a screenshot
    for (const view of views) {
      if (!screenshotUrls[view.id]) {
        try {
          // Load the view
          if (view.mvsj) {
            await viewer.setState(view.mvsj);

            // Take screenshot
            const url = await viewer.screenshot();

            // Save the screenshot URL
            setScreenshotUrls((prev) => ({
              ...prev,
              [view.id]: url,
            }));
          }
        } catch (error) {
          console.error(
            `Failed to generate screenshot for view ${view.id}:`,
            error,
          );
        }
      }
    }
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
    generateMissingScreenshots,
  };
}
