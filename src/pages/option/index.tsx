import { useEffect } from "react";
import { Link as ReactLink, useNavigate } from "react-router-dom";

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Link,
  VStack,
  css,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { ExternalLink } from "tabler-icons-react";

import Preferences from "~/components/block/Preferences";
import AlertDialog from "~/components/common/AlertDialog";
import db from "~/utils/db";
import { webhookUrlAtom } from "~/utils/jotai";

const OptionPage = () => {
  const navigate = useNavigate();
  const [WebhookUrl, setWebhookUrl] = useAtom(webhookUrlAtom);
  const latestVersion = import.meta.env.VITE_APP_VERSION;

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <div>
      <div>
        <h2>アプリ設定</h2>
        <Preferences />
        <VStack gap="0.5rem" pt={2} px={2}>
          <FormControl>
            <FormLabel className={css({ flexGrow: 1 })}>Webhook</FormLabel>
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
              type="url"
              value={WebhookUrl}
              w="100%"
            />
          </FormControl>
          <FormControl>
            <div
              className={css({
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              <div>
                <FormLabel className={css({ flexGrow: 1 })}>
                  アプリの初期化
                </FormLabel>
                <FormHelperText>
                  アプリが上手く動作しない場合にお試しください。
                </FormHelperText>
              </div>
              <Button colorScheme="red" onClick={onOpen}>
                初期化する
              </Button>
            </div>
          </FormControl>
        </VStack>
        <AlertDialog
          body="アプリのデータを初期化します。この操作は取り消せません。"
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={deleteAppData}
          title="アプリの初期化"
        />
      </div>
      <div>
        <h2>アプリ情報</h2>
        <p>
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
        </p>
        <div>
          <table>
            <tbody>
              <tr>
                <th>バージョン</th>
                <td>v{localStorage.getItem("scorewatcher-version")}</td>
              </tr>
              <tr>
                <th>開発者</th>
                <td>
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
                </td>
              </tr>
              <tr>
                <th>リポジトリ</th>
                <td>
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OptionPage;
