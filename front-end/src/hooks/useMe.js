import { useAuth } from "../contexts/AuthContext";

export function useMe() {
  const { user, loading } = useAuth();
  return { me: user, loading };
}
