import { useAuth } from "./useAuth";

export function useMe() {
  const { user, loading } = useAuth();
  return { me: user, loading };
}
