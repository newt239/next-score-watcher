"use client";
import { ArrowBackUp, Comet, Maximize, Settings } from "tabler-icons-react";

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: [0, 0, 3],
          height: ["10vh", "10vh", "15vh"],
          px: 1,
          borderStyle: "solid",
          borderWidth: "0px 0px thin",
          borderColor: "gray.300",
          bgColor: "gray.50",
          _dark: {
            borderColor: "gray.500",
            bgColor: "gray.700",
          },
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 0,
            maxWidth: [`calc(100vw - 10rem)`, null, "30vw"],
            color: "green.600",
            h: "100%",
            _dark: {
              color: "green.300",
            },
          })}
        >
          <h2 style={{ lineHeight: "2rem", overflow: "hidden" }}>
            {game.name}
          </h2>
          <p>{getRuleStringByType(game)}</p>
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div className={css({ whiteSpace: "nowrap", lineHeight: "2.5rem" })}>
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
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              fontSize: "1.5rem",
              lineHeight: "1.5rem",
              overflow: "hidden",
            })}
          >
            <div className={css({ maxHeight: "8vh" })}>
              ここに問題文が表示されます
            </div>
            <div
              className={css({
                textAlign: "right",
                color: "red.600",
                bgColor: "gray.50",
                fontWeight: 800,
                _dark: {
                  color: "red.300",
                  bgColor: "gray.700",
                },
              })}
            >
              ここに答えが表示されます
            </div>
          </div>
        )}
        <Menu closeOnSelect={false} label={<Settings />}>
          <MenuItem disabled={game.editable}>
            <Comet />
            スルー
          </MenuItem>
          <MenuItem
            disabled={logs.length === 0 || game.editable}
            onClick={async () => {
              if (logs.length !== 0) {
                await db.logs.delete(logs[logs.length - 1].id);
              }
            }}
          >
            <ArrowBackUp />
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
          {document.fullscreenEnabled && (
            <MenuItem
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              <Maximize />
              フルスクリーン
            </MenuItem>
          )}
        </Menu>
      </div>
      {/* <PreferenceModal isOpen={isOpen} onClose={onClose} /> */}
    </>
  );
};

export default BoardHeader;
