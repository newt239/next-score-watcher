"use client";
import { ArrowBackUp, Comet, Maximize, Settings } from "tabler-icons-react";

import Anchor from "#/app/_components/Anchor";
import Menu, { MenuItem } from "#/app/_components/Menu";
import Switch from "#/app/_components/Switch";
import db from "#/utils/db";
import { getRuleStringByType } from "#/utils/rules";
import { GameDBProps, GameLogPropsOnSupabase } from "#/utils/types";
import { css } from "@panda/css";

type BoardHeaderProps = {
  game: GameDBProps;
  logs: GameLogPropsOnSupabase[];
};

const BoardHeader: React.FC<BoardHeaderProps> = ({ game, logs }) => {
  return (
    <>
      <div
        className={css({
          _dark: {
            borderColor: "gray.500",
            bgColor: "gray.700",
          },
          alignItems: "center",
          bgColor: "gray.50",
          borderColor: "gray.300",
          borderStyle: "solid",
          borderWidth: "0px 0px thin",
          display: "flex",
          gap: [0, 0, 3],
          height: ["10vh", "10vh", "15vh"],
          justifyContent: "space-between",
          px: 1,
        })}
      >
        <div
          className={css({
            _dark: {
              color: "green.300",
            },
            color: "green.600",
            display: "flex",
            flexDirection: "column",
            h: "100%",
            justifyContent: "center",
            maxWidth: [`calc(100vw - 10rem)`, null, "30vw"],
            p: 0,
          })}
        >
          <h2 style={{ lineHeight: "2rem", overflow: "hidden" }}>
            {game.name}
          </h2>
          <p>{getRuleStringByType(game)}</p>
        </div>
        <div
          className={css({
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          })}
        >
          <div className={css({ lineHeight: "2.5rem", whiteSpace: "nowrap" })}>
            第
            <span className={css({ fontSize: "2.5rem", fontWeight: 800 })}>
              {logs.length + 1}
            </span>
            問
          </div>
        </div>
        {game.quiz && (
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              fontSize: "1.5rem",
              height: "100%",
              justifyContent: "space-between",
              lineHeight: "1.5rem",
              overflow: "hidden",
            })}
          >
            <div className={css({ maxHeight: "8vh" })}>
              ここに問題文が表示されます
            </div>
            <div
              className={css({
                _dark: {
                  bgColor: "gray.700",
                  color: "red.300",
                },
                bgColor: "gray.50",
                color: "red.600",
                fontWeight: 800,
                textAlign: "right",
              })}
            >
              ここに答えが表示されます
            </div>
          </div>
        )}
        <Menu closeOnSelect={false} label={<Settings />}>
          <MenuItem disabled={game.editable} icon={<Comet />}>
            スルー
          </MenuItem>
          <MenuItem
            disabled={logs.length === 0 || game.editable}
            icon={<ArrowBackUp />}
            onClick={async () => {
              if (logs.length !== 0) {
                await db.logs.delete(logs[logs.length - 1].id);
              }
            }}
          >
            一つ戻す
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await db.games.update(game.id, {
                editable: !game.editable,
              });
            }}
          >
            <Switch checked={game.editable}>スコアの手動更新</Switch>
          </MenuItem>
          {typeof window !== "undefined" && document.fullscreenEnabled && (
            <MenuItem
              icon={<Maximize />}
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              フルスクリーン
            </MenuItem>
          )}
          <Anchor
            className={css({
              color: "inherit",
              textDecoration: "none",
            })}
            href={`/games/${game.id}/config`}
          >
            <MenuItem icon={<Settings />}>設定に戻る</MenuItem>
          </Anchor>
        </Menu>
      </div>
      {/* <PreferenceModal isOpen={isOpen} onClose={onClose} /> */}
    </>
  );
};

export default BoardHeader;
