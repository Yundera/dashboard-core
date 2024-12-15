import {useGetIdentity as rauseGetIdentity, UseGetIdentityResult} from "react-admin";

import {ExtendedUserIdentity} from "../../interface/ExtendedUserIdentity";

export type UseGetIdentityExtendedResult = UseGetIdentityResult & {
  identity: ExtendedUserIdentity;
};

export function useGetIdentity():UseGetIdentityExtendedResult {
  const gi = rauseGetIdentity();
  return gi as unknown as UseGetIdentityExtendedResult;
}