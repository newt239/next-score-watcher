"use client";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

const GlobalError = ({ error }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <Error />
      </body>
    </html>
  );
};

export default GlobalError;
