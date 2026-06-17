"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { theme } from "@/utils/theme";

import UpdateModal from "./UpdateModal/UpdateModal";

type ClientRootProps = {
  children: React.ReactNode;
};

/**
 * クライアント側のルートレイアウトを提供するコンポーネント
 */
const ClientRoot: React.FC<ClientRootProps> = ({ children }) => {
  return (
    <>
      <NuqsAdapter>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            {children}
            <UpdateModal />
          </ModalsProvider>
          <Notifications />
        </MantineProvider>
      </NuqsAdapter>
    </>
  );
};

export default ClientRoot;
