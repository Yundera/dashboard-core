import type {UserIdentity} from "ra-core/src/types";

export interface ExtendedUserIdentity extends UserIdentity {
  id: string,
  fullName: string,
  avatar: string
  email: string,
  emailVerified: boolean,
  authToken: string,
}