import { headers } from "next/headers";

import { auth } from "@/utils/auth/auth";

export const getUserId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }
  return session.user.id;
};
