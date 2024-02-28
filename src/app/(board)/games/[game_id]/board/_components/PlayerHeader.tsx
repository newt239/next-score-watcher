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
        display: "flex",
        flexDirection: "column",
        fontWeight: 800,
        justifyContent: "center",
        lg: {
          alignItems: "center",
        },
        lineHeight: "1rem",
        w: "100%",
        whiteSpace: "nowrap",
      })}
    >
      {text === "" && belong === "" ? (
        <div className={css({ h: "1rem", lg: { my: "0.5rem" }, opacity: 0.3 })}>
          {index + 1}
        </div>
      ) : (
        <>
          <div className={css({ h: "1rem" })}>{text}</div>
          <div
            className={css({
              lg: {
                h: "1rem",
              },
              overflowX: "hidden",
              textOverflow: "ellipsis",
              w: "100%",
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
