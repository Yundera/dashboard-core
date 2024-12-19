import {useAuthProvider as rauseAuthProvider} from "react-admin";
import type {EmailAuthProviderInterface} from "../../interface/EmailAuthProviderInterface";
import {useEffect, useState} from "react";

export const useAuthProvider = () => {
  const ap = rauseAuthProvider() as unknown as EmailAuthProviderInterface;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await ap.authStateReady();
      setLoading(false);
    })();
  }, []);
  return {...ap,loading};
}