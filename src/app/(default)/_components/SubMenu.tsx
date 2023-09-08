import Link from "next/link";

import { Button, Flex } from "@chakra-ui/react";

const linkList: { text: string; path: string }[] = [
  { text: "ホーム", path: "/" },
  { text: "プレイヤー管理", path: "/player" },
  { text: "問題管理", path: "/quiz" },
  { text: "アプリ設定", path: "/option" },
];

const SubMenu: React.FC = () => {
  return (
    <Flex fontWeight={800}>
      {linkList.map((link) => (
        <Button
          as={Link}
          href={link.path}
          key={link.path}
          size="sm"
          variant="ghost"
        >
          {link.text}
        </Button>
      ))}
    </Flex>
  );
};

export default SubMenu;
