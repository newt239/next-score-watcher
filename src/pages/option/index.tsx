import { useEffect, useRef } from "react";
import { Link as ReactLink, useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { ExternalLink } from "tabler-icons-react";

import Preferences from "#/components/Preferences";
import db from "#/utils/db";
import { webhookUrlAtom } from "#/utils/jotai";

const OptionPage = () => {
  const navigate = useNavigate();
  const [WebhookUrl, setWebhookUrl] = useAtom(webhookUrlAtom);
  const latestVersion = import.meta.env.VITE_APP_VERSION;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  useEffect(() => {
    document.title = "アプリ設定 | Score Watcher";
  }, []);

  const deleteAppData = () => {
    localStorage.setItem("scorewatcher-version", latestVersion!);
    db.delete().then(() => {
      navigate(0);
    });
  };

  return (
    <Container>
      <h2>アプリ設定</h2>
      <Preferences />
      <Stack sx={{ gap: 5, pt: 5 }}>
        <FormControl>
          <FormLabel sx={{ flexGrow: 1 }}>Webhook</FormLabel>
          <FormHelperText>
            イベント発生時設定されたURLへPOSTリクエストを送信します。詳しくは
            <Link as={ReactLink} color="blue.500" to="/option/webhook">
              webhookについて
            </Link>
            を御覧ください。
          </FormHelperText>
          <Input
            mt={3}
            onChange={(v) => setWebhookUrl(v.target.value)}
            placeholder="https://score-watcher.newt239.dev/api"
            value={WebhookUrl}
            w="100%"
          />
        </FormControl>
        <FormControl>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <FormLabel sx={{ flexGrow: 1 }}>アプリの初期化</FormLabel>
              <FormHelperText>
                アプリが上手く動作しない場合にお試しください。
              </FormHelperText>
            </Box>
            <Button colorScheme="red" onClick={onOpen}>
              初期化する
            </Button>
          </Flex>
        </FormControl>
      </Stack>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              アプリを初期化します
            </AlertDialogHeader>
            <AlertDialogBody>
              この操作は取り消せません。本当に初期化してよろしいですか？
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} ref={cancelRef}>
                やめる
              </Button>
              <Button colorScheme="red" ml={3} onClick={deleteAppData}>
                初期化する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <h2 style={{ paddingTop: "1rem" }}>アプリ情報</h2>
      <Text>
        アップデート情報は
        <Link
          color="blue.500"
          href="https://github.com/newt239/next-score-watcher/releases"
          isExternal
        >
          リリースノート
          <Icon>
            <ExternalLink />
          </Icon>
        </Link>
        をご確認ください。
      </Text>
      <TableContainer>
        <Table>
          <Tbody>
            <Tr>
              <Th>バージョン</Th>
              <Td isNumeric>v{localStorage.getItem("scorewatcher-version")}</Td>
            </Tr>
            <Tr>
              <Th>開発者</Th>
              <Td isNumeric>
                <Link
                  color="blue.500"
                  href="https://twitter.com/newt239"
                  isExternal
                >
                  newt239
                  <Icon>
                    <ExternalLink />
                  </Icon>
                </Link>
              </Td>
            </Tr>
            <Tr>
              <Th>リポジトリ</Th>
              <Td isNumeric>
                <Link
                  color="blue.500"
                  href="https://github.com/newt239/next-score-watcher"
                  isExternal
                >
                  newt239/next-score-watcher
                  <Icon>
                    <ExternalLink />
                  </Icon>
                </Link>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OptionPage;
