import {useEffect, useState} from "react";
import {useAuthProvider} from "./useAuthProvider";

export function usePermission(permissionKey: string): { hasPermission: boolean; loading: boolean } {
  const authProvider = useAuthProvider();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    (async () => {
      setHasPermission(await authProvider.hasPermission(permissionKey));
      setLoading(false);
    })()
  }, []);

  return {
    loading: authProvider.loading || loading,
    hasPermission: hasPermission,
  };
}