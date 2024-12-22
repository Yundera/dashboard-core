import {ExtendedUserIdentity} from "./ExtendedUserIdentity";
import {AuthProviderEmailUser} from "./AuthProviderEmailUser";
import {AuthProviderPermissions} from "./AuthProviderPermissions";
import {AuthProviderAPIAccess} from "./AuthProviderAPIAccess";

export interface ExtendedAuthProviderInterface extends AuthProviderAPIAccess, AuthProviderEmailUser,AuthProviderPermissions{
  login(params: { username: string; password: string }): Promise<any>;
  logout: (params: any) => Promise<void | false | string>;
  checkAuth: (params: any) => Promise<void>;
  checkError: (error: any) => Promise<void>;
  getIdentity(): Promise<ExtendedUserIdentity>;
}