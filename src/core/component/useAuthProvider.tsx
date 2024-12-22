import {useAuthProvider as rauseAuthProvider} from "react-admin";
import type {ExtendedAuthProviderInterface} from "../../interface/ExtendedAuthProviderInterface";
import {useEffect, useState} from "react";

interface LoadingInterface {
  loading: boolean;
}

export const useAuthProvider = (): (ExtendedAuthProviderInterface & LoadingInterface) => {
  const ap = rauseAuthProvider() as unknown as ExtendedAuthProviderInterface;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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