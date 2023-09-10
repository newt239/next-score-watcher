import Link from "next/link";

import { Button, Flex } from "@radix-ui/themes";

const linkList: { text: string; path: string }[] = [
  { text: "ホーム", path: "/" },
  { text: "プレイヤー管理", path: "/player" },
  { text: "問題管理", path: "/quiz" },
  { text: "アプリ設定", path: "/option" },
];

const SubMenu: React.FC = () => {
  return (
    <Flex>
      {linkList.map((link) => (
        <Button asChild key={link.path} variant="ghost">
          <Link href={link.path}>{link.text}</Link>
        </Button>
      ))}
    </Flex>
  );
};

export default SubMenu;
