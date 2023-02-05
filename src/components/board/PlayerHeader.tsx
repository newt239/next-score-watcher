import { useMediaQuery } from "@chakra-ui/react";

type PlayerHeaderProps = {
  index: number;
  text: string;
  belong: string;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ index, text, belong }) => {
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  return (
    <>
      {isLargerThan700 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          {text === "" ? (
            <div style={{ opacity: 0.3 }}>{index + 1}</div>
          ) : (
            <div>{text}</div>
          )}
          <div>{belong === "" ? "―――――" : belong}</div>
        </div>
      ) : (
        <div
          style={{
            fontSize: "0.8rem",
            lineHeight: "0.8rem",
            fontWeight: 800,
            paddingTop: 5,
            whiteSpace: "nowrap",
            overflowX: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text === "" && belong === "" && (
            <span style={{ opacity: 0.3 }}>Player{index + 1}</span>
          )}
          <span>{text !== "" && text}</span>
          <span>{text !== "" && belong !== "" && " ・ "}</span>
          <span>{belong !== "" && belong}</span>
        </div>
      )}
    </>
  );
};

export default PlayerHeader;
