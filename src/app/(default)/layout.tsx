import { Box, Flex } from "@mantine/core";

import Header from "./_components/Header/Header";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex className="flex-col md:flex-row">
      <Header />
      <Box className="mb-20 mt-[60px] w-full max-w-[1300px] p-4 md:ml-[300px] md:mt-0">
        {children}
      </Box>
    </Flex>
  );
}
