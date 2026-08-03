import { useAuth } from "./useAuth";
import { isAdmin, logout } from "../firebase/firebase";

/**
 * Custom hook providing admin authorization state and utilities.
 * @returns {{
 *   user: import("firebase/auth").User | null,
 *   loading: boolean,
 *   isAuthenticated: boolean,
 *   isAuthorized: boolean,
 *   logout: () => Promise<void>
 * }}
 */
export function useAdminAuth() {
  const { user, loading, isAuthenticated } = useAuth();
  const isAuthorized = isAdmin(user);

  return {
    user,
    loading,
    isAuthenticated,
    isAuthorized,
    logout,
  };
}

export { isAdmin };
export default useAdminAuth;
