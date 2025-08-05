import { hc } from "hono/client";

import type { APIRouteType } from "@/server";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
  : "http://localhost:3000";

const apiClient = hc<APIRouteType>(`${baseUrl}/api`, {
  init: {
    credentials: "include",
  },
});

export default apiClient;
