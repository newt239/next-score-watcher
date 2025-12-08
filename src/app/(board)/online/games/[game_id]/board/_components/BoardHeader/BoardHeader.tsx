"use client";

import { useEffect, useState } from "react";

import { ActionIcon, Box, Flex, Menu, MenuDivider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUp,
  IconBalloon,
  IconComet,
  IconMaximize,
  IconSettings,
} from "@tabler/icons-react";

import PreferenceDrawer from "../PreferenceDrawer/PreferenceDrawer";

import classes from "./BoardHeader.module.css";

import type { RuleNames } from "@/models/game";
import type { UserPreferencesType } from "@/models/user-preference";

import Link from "@/components/Link";
import { rules } from "@/utils/rules";

type OnlineGame = {
  id: string;
  name: string;
  ruleType: RuleNames;
  win_point?: number; // nbyn形式で使用
};

type BoardHeaderProps = {
  game: OnlineGame;
  logsLength: number;
  onUndo: () => void;
  onThrough: () => void;
  preferences: UserPreferencesType | null;
  userId: string;
};

const BoardHeader: React.FC<BoardHeaderProps> = ({
  game,
  logsLength,
  onUndo,
  onThrough,
  preferences,
  userId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);

  // API経由で設定を取得（デフォルト値を設定）
  const showBoardHeader = preferences?.showBoardHeader ?? true;
  const showQn = preferences?.showQn ?? false;

  useEffect(() => {
    // クライアントサイドでのみフルスクリーン機能の有効性をチェック
    setIsFullscreenEnabled(
      typeof document !== "undefined" && document.fullscreenEnabled
    );
  }, []);

  // オンライン版用のルール名表示関数
  const getRuleDisplayName = (ruleType: RuleNames): string => {
    return rules[ruleType].name;
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
              <span>{getRuleDisplayName(game.ruleType)}</span>
            </div>
          ) : (
            <Flex className={classes.game_info_wrapper}>
              <Flex className={classes.game_info_area} data-showqn={showQn}>
                <div className={classes.game_name}>{game.name}</div>
                <div>{getRuleDisplayName(game.ruleType)}</div>
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
            {isFullscreenEnabled && (
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
      <PreferenceDrawer
        isOpen={opened}
        onClose={close}
        userId={userId}
        initialPreferences={preferences}
      />
    </>
  );
};

export default BoardHeader;
