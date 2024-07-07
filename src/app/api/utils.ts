import { cookies } from 'next/headers';

// Function to validate SAS token
export function isSasTokenExpired(cookieName: string): boolean {
  const sasTokenCookie = cookies().get(cookieName);

  if (sasTokenCookie === undefined) return true;

  const params = new URLSearchParams(sasTokenCookie.value);
  const expiryTime = params.get('se');
  if (!expiryTime) return true;

  const expiryDate = new Date(expiryTime);
  const currentDate = new Date();

  return currentDate >= expiryDate;
}
