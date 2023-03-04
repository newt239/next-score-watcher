import { ListItem, UnorderedList } from "@chakra-ui/react";

import H2 from "#/blocks/H2";

const Term: React.FC = () => {
  return (
    <>
      <H2>本ソフトのご利用にあたって</H2>
      <UnorderedList py={5}>
        <ListItem>
          本ソフトはあくまで「得点表示ソフト」であり、問題やプレイヤー、試合記録の管理ソフトではありません。
        </ListItem>
        <ListItem>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </ListItem>
        <ListItem>
          本ソフトの開発者はユーザーが本ソフトを使用したことにより生じる損害について、いかなる責任も負いません。
        </ListItem>
      </UnorderedList>
    </>
  );
};

export default Term;
