import { zenkaku2Hankaku } from "#/utils/functions";
import { css } from "@panda/css";

type PlayerNameProps = {
  player_name: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ player_name }) => {
  return (
    <div
      className={css({
        display: "flex",
        flexGrow: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        textOrientation: "upright",
        writingMode: "horizontal-tb",
        whiteSpace: "nowrap",
        fontFamily: "BIZ UDGothic",
        fontSize: "2rem",
        fontWeight: 800,
        w: "100%",
        overflowX: "hidden",
        textOverflow: "ellipsis",
      })}
    >
      {zenkaku2Hankaku(player_name)}
    </div>
  );
};

export default PlayerName;
