import { Link as ReactLink } from "react-router-dom";

import { Button, Flex, IconButton } from "@chakra-ui/react";
import { BrandDiscord } from "tabler-icons-react";

const linkList: { text: string; path: string }[] = [
  { text: "ホーム", path: "/" },
  { text: "プレイヤー管理", path: "/player" },
  { text: "問題管理", path: "/quiz" },
  { text: "アプリ設定", path: "/option" },
];

const SubMenu: React.FC = () => {
  return (
    <Flex
      sx={{
        fontWeight: 800,
      }}
    >
      {linkList.map((link) => (
        <Button
          as={ReactLink}
          key={link.path}
          size="sm"
          to={link.path}
          variant="ghost"
        >
          {link.text}
        </Button>
      ))}
      <IconButton
        aria-label="Discordサーバーに参加する"
        as="a"
        href="https://discord.gg/rct5sx6rbZ"
        icon={<BrandDiscord />}
        size="sm"
        target="_blank"
        variant="ghost"
      />
    </Flex>
  );
};

export default SubMenu;
