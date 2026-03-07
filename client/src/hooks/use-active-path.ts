import { useLocation } from "react-router";

/**
 * Custom hook to determine if a given path is the currently active route.
 * This hook uses React Router's useLocation to access the current pathname
 * and provides a utility function to check path equality.
 *
 * @returns An object containing:
 * - `isActive`: Function to check if a target path matches the current pathname.
 */
export const useActivePath = () => {
  const { pathname } = useLocation();

  /**
   * Checks if the provided target path exactly matches the current pathname.
   *
   * @param targetPath - The path to compare against the current pathname.
   * @returns True if the target path matches the current pathname, false otherwise.
   */
  const isActive = (targetPath: string) => {
    return pathname === targetPath;
  };

  return { isActive };
};
