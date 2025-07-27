import type { NextRequest } from "next/server";

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export async function onRequestError(
  err: unknown,
  request: NextRequest,
  _context?: unknown
) {
  // Capture the error with additional context
  Sentry.captureException(err, {
    contexts: {
      request: {
        url: request?.url,
        method: request?.method,
      },
    },
  });
}
