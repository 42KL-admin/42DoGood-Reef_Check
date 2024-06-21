import { cookies } from "next/headers";

export const SAS_COOKIE_NAME  = 'RCSasToken';
export const USER_COOKIE		  = 'RCUserCookie';
// Function to validate SAS token
export function isSasTokenExpired(): boolean {
  const sasTokenCookie = cookies().get(SAS_COOKIE_NAME);

  if (sasTokenCookie === undefined) return true;

  const params = new URLSearchParams(sasTokenCookie.value);
  const expiryTime = params.get("se");
  if (!expiryTime) return true;

  const expiryDate = new Date(expiryTime);
  const currentDate = new Date();

  return currentDate >= expiryDate;
}
