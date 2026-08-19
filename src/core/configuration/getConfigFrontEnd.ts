type Config = {
  BASE_PATH: string;
  // Public base of the orchestrator API, e.g. https://app.yundera.com/service/pcs.
  // Already published to the frontend via FRONTEND_PUBLIC_ENV. The Yundera OIDC
  // provider is mounted at `${VNAS_BACKEND}/auth`, so its RP-initiated logout
  // endpoint is derivable from it — see FirebaseAuthProvider.logout().
  VNAS_BACKEND: string;
  // Optional explicit override for that derivation. Only needed if the IdP is
  // ever moved off the orchestrator's origin; unset is the normal case.
  SSO_LOGOUT_URL: string;
};

export function getConfig(key: keyof Config): string {
  return (window as any).APP_CONFIG[key];
}