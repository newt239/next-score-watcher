import { Link as ReactLink } from "react-router-dom";

import Hamburger from "~/features/components/Hamburger";
import SubMenu from "~/features/components/SubMenu";

import { Box } from "@chakra-ui/react";
import Link from "~/components/custom/Link";
import ProfileSelector from "./ProfileSelector";

const Header: React.FC = () => {
  return (
    <Box
      as="header"
      sx={{
        backgroundColor: "white",
        left: 0,
        lg: {
          height: "100vh",
          p: "16px",
          width: 300,
        },
        p: 0,
        position: "fixed",
        top: 0,
        w: "100%",
        zIndex: 3,
        _dark: {
          backgroundColor: "gray.800",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
          lg: {
            flexDirection: "column",
            h: "100%",
          },
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
            display: "block",
            lg: {
              display: "none",
            },
          }}
        >
          <Hamburger>
            <SubMenu />
          </Hamburger>
        </Box>
        <Box
          sx={{
            display: "none",
            flexGrow: 1,
            lg: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
        >
          <SubMenu />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
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
