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
        // checkAuth implementations are expected to redirect the browser on
        // failure (e.g. settings-center-app's LocalAuthProvider bounces to
        // /login). Logging here is fine; we deliberately do not swallow the
        // failure into a successful "loaded" state — the navigation is
        // already underway, and any consumer that renders despite this
        // would otherwise paint stale UI behind the redirect.
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  (ap as unknown as LoadingInterface).loading = loading;
  return ap as (ExtendedAuthProviderInterface & LoadingInterface);
}