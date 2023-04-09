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
  Th,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { ExternalLink } from "tabler-icons-react";

import AppOptionSwitch from "#/components/AppOptionSwitch";
import db from "#/utils/db";
import {
  reversePlayerInfoAtom,
  showLogsAtom,
  showSignStringAtom,
  showWinthroughPopupAtom,
  verticalViewAtom,
  webhookUrlAtom,
  wrongNumberAtom,
} from "#/utils/jotai";

const OptionPage = () => {
  const navigate = useNavigate();
  const [showWinthroughPopup, showSetWinthroughPopup] = useAtom(
    showWinthroughPopupAtom
  );
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [showSignString, setShowSignString] = useAtom(showSignStringAtom);
  const [reversePlayerInfo, setReversePlayerInfo] = useAtom(
    reversePlayerInfoAtom
  );
  const [verticalView, setVerticalView] = useAtom(verticalViewAtom);
  const [wrongNumber, setWrongNumber] = useAtom(wrongNumberAtom);
  const [WebhookUrl, setWebhookUrl] = useAtom(webhookUrlAtom);
  const latestVersion = import.meta.env.VITE_APP_VERSION;

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  useEffect(() => {
    document.title = "アプリ設定 | ScoreWatcher";
  }, []);

  const deleteAppData = () => {
    localStorage.setItem("scorewatcher-version", latestVersion!);
    db.delete().then(() => {
      navigate(0);
    });
  };

  return (
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
      <h2>アプリ設定</h2>
      <Stack sx={{ gap: 5, pt: 5 }}>
        <AppOptionSwitch
          title="ダークモード"
          isChecked={colorMode === "dark"}
          onChange={() => toggleColorMode()}
        />
        <AppOptionSwitch
          title="勝ち抜け時にポップアップを表示"
          isChecked={showWinthroughPopup}
          onChange={() => showSetWinthroughPopup((v) => !v)}
        />
        <AppOptionSwitch
          title="スコアに「○」「✕」「pt」の文字列を付与する"
          label="視聴者が数字の意味を理解しやすくなります。"
          isChecked={showSignString}
          onChange={() => setShowSignString((v) => !v)}
        />
        <AppOptionSwitch
          title="得点表示画面下にログを表示"
          isChecked={showLogs}
          onChange={() => setShowLogs((v) => !v)}
        />
        <AppOptionSwitch
          title="スコアを名前の前に表示"
          isChecked={reversePlayerInfo}
          onChange={() => setReversePlayerInfo((v) => !v)}
        />
        <AppOptionSwitch
          title="プレイヤーを垂直に並べる"
          isChecked={verticalView}
          onChange={() => setVerticalView((v) => !v)}
        />
        <AppOptionSwitch
          title="誤答数を✕の数で表示"
          label="誤答数が0のときは中黒・で表示されます。"
          isChecked={wrongNumber}
          onChange={() => setWrongNumber((v) => !v)}
        />
        <FormControl>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <FormLabel sx={{ flexGrow: 1 }}>Webhook</FormLabel>
              <FormHelperText>
                [β版]イベント発生時設定されたURLへPOSTリクエストを送信します。詳しくは
                <ReactLink to="/option/webhook">
                  <Link color="blue.500">Webhookについて</Link>
                </ReactLink>
                を御覧ください。
              </FormHelperText>
            </Box>
            <Input
              value={WebhookUrl}
              onChange={(v) => setWebhookUrl(v.target.value)}
              placeholder="https://score-watcher.newt239.dev/api"
              w="50%"
            />
          </Flex>
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
              <Button ref={cancelRef} onClick={onClose}>
                やめる
              </Button>
              <Button colorScheme="red" onClick={deleteAppData} ml={3}>
                初期化する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <h2>アプリ情報</h2>
      <TableContainer pt={5}>
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
                  href="https://twitter.com/newt239"
                  isExternal
                  color="blue.500"
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
                  href="https://github.com/newt239/next-score-watcher"
                  isExternal
                  color="blue.500"
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
