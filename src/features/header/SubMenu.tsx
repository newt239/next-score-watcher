import { useLocation } from "react-router-dom";

import { Flex } from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";
import ButtonLink from "~/components/custom/ButtonLink";

const linkList: { text: string; path: string }[] = [
  { path: "/", text: "ホーム" },
  { path: "/rules", text: "形式一覧" },
  { path: "/games", text: "作成したゲーム" },
  { path: "/players", text: "プレイヤー管理" },
  { path: "/quizes", text: "問題管理" },
  { path: "/option", text: "アプリ設定" },
  { path: "https://docs.score-watcher.com/", text: "使い方を見る" },
];

const SubMenu: React.FC = () => {
  const location = useLocation();

  return (
    <Flex sx={{ flexDirection: "column" }}>
      {linkList.map((link) => (
        <ButtonLink
          colorScheme="green"
          aria-current={link.path === location.pathname}
          href={link.path}
          key={link.path}
          variant={link.path === location.pathname ? "solid" : "ghost"}
        >
          {link.text}
          {link.path.startsWith("http") && (
            <ExternalLink style={{ marginLeft: "0.5rem" }} />
          )}
        </ButtonLink>
      ))}
    </Flex>
  );
};

export default SubMenu;
