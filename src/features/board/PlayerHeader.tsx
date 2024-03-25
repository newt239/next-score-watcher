import { useAtomValue } from "jotai";

import { reversePlayerInfoAtom } from "#/utils/jotai";
import { css } from "@panda/css";

type PlayerHeaderProps = {
  index: number;
  text: string;
  belong: string;
  isVerticalView: boolean;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  index,
  text,
  belong,
  isVerticalView,
}) => {
  const reversePlayerInfo = useAtomValue(reversePlayerInfoAtom);

  return (
    <>
      {isVerticalView ? (
        <div
          className={css({
            w: "100%",
            fontSize: "0.8rem",
            lineHeight: "0.8rem",
            fontWeight: 800,
            pt: 1,
            whiteSpace: "nowrap",
            overflowX: "hidden",
            textOverflow: "ellipsis",
          })}
        >
          {text === "" && belong === "" && (
            <div className={css({ opacity: 0.3 })}>プレイヤー{index + 1}</div>
          )}
          <span>{text}</span>
          <span>{text !== "" && belong !== "" && " ・ "}</span>
          <span>{belong !== "" && belong}</span>
        </div>
      ) : text === "" && belong === "" ? (
        <div className={css({ my: "0.5rem", opacity: 0.3, h: "3rem" })}>
          {index + 1}
        </div>
      ) : (
        <div
          className={css({
            display: "flex",
            flexDirection: reversePlayerInfo ? "column-reverse" : "column",
            alignItems: "center",
            justifyContent: "center",
            w: "100%",
            fontWeight: 800,
            whiteSpace: "nowrap",
            lineHeight: "1.5rem",
            h: "3rem",
          })}
        >
          <div>{text}</div>
          <div
            className={css({
              w: "100%",
              overflowX: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            })}
          >
            {belong}
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerHeader;
