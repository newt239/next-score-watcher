import { useLocation } from "react-router-dom";

import { css } from "@panda/css";
import ButtonLink from "~/components/custom/ButtonLink";

const linkList: { text: string; path: string }[] = [
  { path: "/", text: "ホーム" },
  { path: "/games", text: "作成したゲーム" },
  { path: "/players", text: "プレイヤー管理" },
  { path: "/quizes", text: "問題管理" },
  { path: "/config", text: "アプリ設定" },
];

const SubMenu: React.FC = () => {
  const location = useLocation();

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
      })}
    >
      {linkList.map((link) => (
        <ButtonLink
          aria-current={link.path === location.pathname}
          className={css({
            _currentPage: {
              bgColor: "emerald.500",
            },
            justifyContent: "flex-start",
            w: "100%",
          })}
          href={link.path}
          key={link.path}
          variant={link.path === location.pathname ? "solid" : "subtle"}
        >
          {link.text}
        </ButtonLink>
      ))}
    </div>
  );
};

export default SubMenu;
