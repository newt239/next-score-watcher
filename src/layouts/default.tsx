import { Outlet } from "react-router-dom";

import { Box, useMediaQuery } from "@chakra-ui/react";
import Header from "~/features/components/Header";

const Layout: React.FC = () => {
  const [isLargerThanLG] = useMediaQuery("(min-width: 992px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isLargerThanLG ? "row" : "column",
        _dark: {
          backgroundColor: "gray.800",
        },
      }}
    >
      <Header />
      <Box
        sx={{
          ml: isLargerThanLG ? 300 : 0,
          mt: isLargerThanLG ? 0 : 50,
          maxWidth: "1300px",
          p: "16px",
          w: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
