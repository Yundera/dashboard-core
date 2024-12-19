import type {AuthProvider} from "ra-core";
import {ExtendedUserIdentity} from "./ExtendedUserIdentity";

export interface AuthProviderAdditionalInterface{
  registerUser(email: string, password: string): Promise<any>;

  updatePassword(newPassword: string): Promise<void>;

  sendResetPasswordMail(email: string): Promise<void>;

  updateEmail(email: string,currentPassword:string): Promise<void>;

  getEmail(): string | null;

  authStateReady(): Promise<void>;

  deleteAccount(currentPassword: string): Promise<void>;

  hasPermission(permission:string): Promise<boolean>;

  listPermissions(): Promise<Record<string,boolean>>;
}

export interface EmailAuthProviderInterface extends AuthProviderAdditionalInterface,AuthProvider{
  login(params: { username: string; password: string }): Promise<any>;
  getIdentity(): Promise<ExtendedUserIdentity>;
}