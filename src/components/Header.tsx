import { Link as ReactLink, useLocation } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";

import Logo from "#/assets/logo.png";
import useDeviceWidth from "#/hooks/useDeviceWidth";

const Header: React.FC = () => {
  const location = useLocation();
  const desktop = useDeviceWidth();
  const { colorMode } = useColorMode();

  const linkList: { text: string; path: string }[] = [
    { text: "ホーム", path: "/" },
    { text: "プレイヤー管理", path: "/player" },
    { text: "問題管理", path: "/quiz" },
    { text: "アプリ設定", path: "/option" },
  ];

  const SubMenu: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
    return (
      <Flex
        sx={{
          flexDirection: vertical ? "column" : "row",
          fontWeight: 800,
        }}
      >
        {linkList.map((link) => (
          <ReactLink key={link.path} to={link.path}>
            <Button variant="ghost">{link.text}</Button>
          </ReactLink>
        ))}
      </Flex>
    );
  };

  if (
    location.pathname.includes("board") ||
    location.pathname.includes("/aql/")
  )
    return null;

  return (
    <Box
      sx={{
        p: 0,
        w: "100%",
        margin: "auto",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        borderStyle: "solid",
        borderWidth: "0px 0px thin",
        borderColor:
          colorMode === "light"
            ? "rgb(231, 235, 240)"
            : "rgba(194, 224, 255, 0.08)",
        backgroundColor:
          colorMode === "light"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(10, 25, 41, 0.7)",
      }}
    >
      <Flex
        sx={{
          maxW: 1000,
          margin: "auto",
          alignItems: "center",
          justifyContent: !desktop ? "center" : undefined,
        }}
      >
        <Box sx={{ transition: "all 0.2s ease-out" }} _hover={{ opacity: 0.5 }}>
          <ReactLink to="/">
            <Image
              src={Logo}
              sx={{
                height: "auto",
                width: "auto",
                pb: 2,
                pl: desktop ? 2 : 0,
                maxHeight: "7vh",
                maxWidth: "300px",
                margin: "auto",
                cursor: "pointer",
              }}
              alt="app logo"
            />
          </ReactLink>
        </Box>
        {desktop && (
          <>
            <Spacer />
            <SubMenu />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
