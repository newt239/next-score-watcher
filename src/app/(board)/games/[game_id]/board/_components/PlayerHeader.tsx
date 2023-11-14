import { css } from "@panda/css";

type PlayerHeaderProps = {
  index: number;
  text: string | null;
  belong: string | null;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ index, text, belong }) => {
  return (
    <div
      className={css({
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        w: "100%",
        fontWeight: 800,
        whiteSpace: "nowrap",
        lineHeight: "1rem",
      })}
    >
      {text === "" && belong === "" ? (
        <div className={css({ h: "1rem", my: "0.5rem", opacity: 0.3 })}>
          {index + 1}
        </div>
      ) : (
        <>
          <div className={css({ h: "1rem" })}>{text}</div>
          <div
            className={css({
              w: "100%",
              h: "1rem",
              overflowX: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            })}
          >
            {belong}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerHeader;
