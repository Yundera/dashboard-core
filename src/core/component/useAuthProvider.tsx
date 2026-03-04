import {useAuthProvider as rauseAuthProvider} from "react-admin";
import type {ExtendedAuthProviderInterface} from "../../interface/ExtendedAuthProviderInterface";
import {useEffect, useState} from "react";

interface LoadingInterface {
  loading: boolean;
}

export const useAuthProvider = (options?: { skipAuthCheck?: boolean }): (ExtendedAuthProviderInterface & LoadingInterface) => {
  const ap = rauseAuthProvider() as unknown as ExtendedAuthProviderInterface;
  const skipAuthCheck = options?.skipAuthCheck ?? false;
  const [loading, setLoading] = useState(!skipAuthCheck);
  useEffect(() => {
    if (skipAuthCheck) return;
    (async () => {
      try {
        await ap.checkAuth({});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  (ap as unknown as LoadingInterface).loading = loading;
  return ap as (ExtendedAuthProviderInterface & LoadingInterface);
}