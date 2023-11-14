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
        justifyContent: "center",
        w: "100%",
        fontWeight: 800,
        whiteSpace: "nowrap",
        lineHeight: "1rem",
        lg: {
          alignItems: "center",
        },
      })}
    >
      {text === "" && belong === "" ? (
        <div className={css({ h: "1rem", opacity: 0.3, lg: { my: "0.5rem" } })}>
          {index + 1}
        </div>
      ) : (
        <>
          <div className={css({ h: "1rem" })}>{text}</div>
          <div
            className={css({
              w: "100%",
              overflowX: "hidden",
              textOverflow: "ellipsis",
              lg: {
                h: "1rem",
              },
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
