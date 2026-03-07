import { useContext } from "react";
import { SidebarOverlayContext } from "../contexts/sidebar-overlay-context";

/**
 * Custom hook to access the sidebar overlay context.
 * This hook provides access to the sidebar overlay state and control functions,
 * allowing components to check if the overlay is open and to open or close it.
 * Must be used within a component that is a descendant of SidebarProvider.
 *
 * @returns The sidebar overlay context object containing:
 * - `isSidebarOverlayOpen`: Boolean indicating if the sidebar overlay is currently open.
 * - `openSidebarOverlay`: Function to open the sidebar overlay.
 * - `closeSidebarOverlay`: Function to close the sidebar overlay.
 * @throws Error if the hook is used outside of a SidebarProvider.
 */
export const useSidebarOverlay = () => {
  const context = useContext(SidebarOverlayContext);
  if (!context) {
    throw new Error("useSidebarOverlay must be used within a SidebarProvider");
  }
  return context;
};
