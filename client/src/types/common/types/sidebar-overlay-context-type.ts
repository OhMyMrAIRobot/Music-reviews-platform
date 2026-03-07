/**
 * Type representing the context for managing the sidebar overlay state and actions.
 */
export type SidebarOverlayContextType = {
  /**
   * Indicates whether the sidebar overlay is currently open.
   */
  isSidebarOverlayOpen: boolean;

  /**
   * Function to open the sidebar overlay.
   */
  openSidebarOverlay: () => void;

  /**
   * Function to close the sidebar overlay.
   */
  closeSidebarOverlay: () => void;
};
