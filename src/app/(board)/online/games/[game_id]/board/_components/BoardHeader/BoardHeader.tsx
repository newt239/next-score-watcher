"use client";

import { ActionIcon, Box, Flex, Menu, MenuDivider } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUp,
  IconBalloon,
  IconComet,
  IconMaximize,
  IconSettings,
} from "@tabler/icons-react";

import PreferenceDrawer from "../PreferenceDrawer";

import classes from "./BoardHeader.module.css";

import type { RuleNames } from "@/utils/types";

import Link from "@/app/_components/Link";
import { rules } from "@/utils/rules";

type Props = {
  game: { id: string; name: string; ruleType: RuleNames };
  logsLength: number;
  onUndo: () => void;
  onThrough: () => void;
};

const BoardHeader: React.FC<Props> = ({
  game,
  logsLength,
  onUndo,
  onThrough,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [showBoardHeader] = useLocalStorage({
    key: "showBoardHeader",
    defaultValue: true,
  });

  const [showQn] = useLocalStorage({
    key: "showQn",
    defaultValue: true,
  });

  const getRuleStringByType = (gameData: {
    name: string;
    ruleType: RuleNames;
  }) => {
    const rule = rules[gameData.ruleType];
    return rule ? rule.name : gameData.ruleType;
  };

  if (!showBoardHeader) return null;

  return (
    <>
      <Flex
        component="header"
        className={classes.board_header}
        data-withname={
          !(game.name === rules[game.ruleType].name || game.name === "")
        }
        data-showquiz={false} // オンライン版では問題セット機能がないためfalse
        data-showqn={showQn}
      >
        {
          // ゲーム名なしの場合
          game.name === rules[game.ruleType].name || game.name === "" ? (
            <div className={classes.game_name_only} data-showqn={showQn}>
              <span>Q{logsLength + 1}</span>
              <span>{getRuleStringByType(game)}</span>
            </div>
          ) : (
            <Flex className={classes.game_info_wrapper}>
              <Flex className={classes.game_info_area} data-showqn={showQn}>
                <div className={classes.game_name}>{game.name}</div>
                <div>{getRuleStringByType(game)}</div>
              </Flex>
              {showQn && (
                <Flex className={classes.quiz_number_area}>
                  <Box className={classes.quiz_number}>Q{logsLength + 1}</Box>
                </Flex>
              )}
            </Flex>
          )
        }
        <Menu>
          <Menu.Target>
            <ActionIcon
              className={classes.board_action}
              variant="default"
              size="xl"
              color="teal"
              m="xs"
            >
              <IconSettings />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={<IconComet />}
              onClick={onThrough}
            >
              スルー
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={<IconArrowBackUp />}
              disabled={logsLength === 0}
              onClick={onUndo}
            >
              一つ戻す
            </Menu.Item>
            {typeof document !== "undefined" && document.fullscreenEnabled && (
              <Menu.Item
                leftSection={<IconMaximize />}
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
              >
                フルスクリーン
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconBalloon />} onClick={open}>
              表示設定
            </Menu.Item>
            <MenuDivider />
            <Menu.Item
              component={Link}
              leftSection={<IconAdjustmentsHorizontal />}
              href={`/online/games/${game.id}/config`}
            >
              ゲーム設定
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <PreferenceDrawer isOpen={opened} onClose={close} />
    </>
  );
};

export default BoardHeader;
