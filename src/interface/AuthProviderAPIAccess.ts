export interface AuthProviderAPIAccess {
  getIdToken(): Promise<string>;
}