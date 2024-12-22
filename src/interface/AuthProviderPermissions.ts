export interface AuthProviderPermissions {
  hasPermission(permission: string): Promise<boolean>;

  listPermissions(): Promise<Record<string, boolean>>;
}