import { Link as ReactLink } from "react-router-dom";

import Link from "~/components/Link";
import Hamburger from "~/features/header/Hamburger";
import ProfileSelector from "~/features/header/ProfileSelector";
import SubMenu from "~/features/header/SubMenu";

import { Box, useMediaQuery } from "@chakra-ui/react";

const Header: React.FC = () => {
  const [isLargerThanLG] = useMediaQuery("(min-width: 992px)");

  return (
    <Box
      as="header"
      sx={{
        backgroundColor: "white",
        left: 0,
        height: isLargerThanLG ? "100vh" : "auto",
        padding: isLargerThanLG ? "16px" : 0,
        position: "fixed",
        top: 0,
        width: isLargerThanLG ? 300 : "100%",
        zIndex: 3,
        _dark: {
          backgroundColor: "gray.800",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isLargerThanLG ? "column" : "row",
          gap: "16px",
          height: isLargerThanLG ? "100%" : "auto",
          justifyContent: "space-between",
          px: "16px",
          py: "8px",
        }}
      >
        <Box
          as={ReactLink}
          sx={{
            _hover: { opacity: 0.5 },
            transition: "all 0.2s ease-out",
            display: "flex",
            justifyContent: "center",
          }}
          to="/"
        >
          <Box
            as="img"
            alt="app logo"
            sx={{
              cursor: "pointer",
              height: "clamp(35px, 10vw, 50px)",
              width: "auto",
              margin: "auto",
              pb: 2,
              pl: [0, 2],
            }}
            src="/logo.png"
          />
        </Box>
        <Box
          sx={{
            display: isLargerThanLG ? "none" : "block",
          }}
        >
          <Hamburger>
            <SubMenu />
          </Hamburger>
        </Box>
        <Box
          sx={{
            display: isLargerThanLG ? "flex" : "none",
            flexGrow: 1,
            flexDirection: isLargerThanLG ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <SubMenu />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              mb: "24px",
            }}
          >
            <ProfileSelector />
            <Box
              sx={{
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              © <Link href="https://twitter.com/newt239">newt239</Link>{" "}
              2022-2024
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
