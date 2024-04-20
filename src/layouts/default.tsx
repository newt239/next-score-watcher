import { Outlet } from "react-router-dom";

import {
  Box,
  Flex,
  Link,
  Slide,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect } from "react";
import ButtonLink from "~/components/custom/ButtonLink";
import Header from "~/features/components/Header";

const Layout: React.FC = () => {
  const [isLargerThanLG] = useMediaQuery("(min-width: 992px)");
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    onToggle();
  }, []);

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
          mb: "100px",
        }}
      >
        <Outlet />
      </Box>

      <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
        <Flex
          p="10px"
          bg="gray.100"
          rounded="md"
          shadow="md"
          color="black"
          alignItems="center"
          justifyContent="space-between"
          gap="4"
          flexDirection={isLargerThanLG ? "row" : "column"}
        >
          <Box>
            <Text>
              Score WatcherのURLが変わりました！今後は下記URLをご利用ください！
            </Text>
            <Text>
              <Link href="https://score-watcher.com/" color="blue.500">
                https://score-watcher.com/
              </Link>
            </Text>
          </Box>
          <Box>
            <ButtonLink
              href="https://score-watcher.com/"
              variant="filled"
              backgroundColor="green.500"
              color="white"
            >
              新しいURLにアクセス
            </ButtonLink>
          </Box>
        </Flex>
      </Slide>
    </Box>
  );
};

export default Layout;
