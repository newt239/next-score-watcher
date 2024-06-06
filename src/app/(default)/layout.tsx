import { Box, Flex } from "@mantine/core";

import Header from "./_components/Header";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex className="flex-col lg:flex-row">
      <Header />
      <Box className="mb-20 mt-[50px] w-full max-w-[1300px] p-4 lg:ml-[300px] lg:mt-0">
        {children}
      </Box>
    </Flex>
  );
}
