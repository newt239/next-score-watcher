import { zenkaku2Hankaku } from "#/utils/functions";
import { css } from "@panda/css";

type PlayerNameProps = {
  player_name: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ player_name }) => {
  return (
    <div
      className={css({
        alignItems: "flex-start",
        display: "flex",
        flexGrow: 1,
        fontFamily: "BIZ UDGothic",
        fontSize: "2rem",
        fontWeight: 800,
        lg: {
          justifyContent: "center",
          textOrientation: "upright",
          writingMode: "horizontal-tb",
        },
        textOverflow: "ellipsis",
        w: "100%",
        whiteSpace: "nowrap",
      })}
    >
      {zenkaku2Hankaku(player_name)}
    </div>
  );
};

export default PlayerName;
