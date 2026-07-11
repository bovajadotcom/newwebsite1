import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export function useAuth() {
  const { data: user, isLoading, error } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      staleTime: 30000,
    },
  });
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    logout,
  };
}
