import { auth } from '@clerk/nextjs/server';

export async function isCurrentUserAdmin() {
  const authObject = await auth();

  const role = (authObject.sessionClaims?.metadata as { role?: string })?.role;

  if (role !== 'admin') {
    return false;
  } else {
    return true;
  }
}
