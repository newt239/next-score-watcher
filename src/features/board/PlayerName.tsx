import useDeviceWidth from "#/features/hooks/useDeviceWidth";
import { zenkaku2Hankaku } from "#/utils/functions";
import { css } from "@panda/css";

type PlayerNameProps = {
  player_name: string;
  isVerticalView: boolean;
};

const PlayerName: React.FC<PlayerNameProps> = ({
  player_name,
  isVerticalView,
}) => {
  const isDesktop = useDeviceWidth();

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: isVerticalView ? "row" : "column",
        flexGrow: 1,
        alignItems: isVerticalView ? "center" : "flex-start",
        justifyContent: isVerticalView ? "flex-start" : "center",
        textOrientation: "upright",
        writingMode:
          !isVerticalView && isDesktop ? "vertical-rl" : "horizontal-tb",
        whiteSpace: "nowrap",
        fontFamily: "BIZ UDGothic",
        fontSize:
          !isVerticalView && isDesktop
            ? `min(calc(50vh / ${player_name.length}), clamp(9vh, 2.5rem, 9vw))`
            : "2rem",
        fontWeight: 800,
        w: "100%",
        pt: !isVerticalView && isDesktop ? 3 : undefined,
        overflowX: "hidden",
        textOverflow: "ellipsis",
      })}
    >
      {zenkaku2Hankaku(player_name)}
    </div>
  );
};

export default PlayerName;
