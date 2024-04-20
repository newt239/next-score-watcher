import { Tab, TabList, useBreakpointValue } from "@chakra-ui/react";

const ConfigTab: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Tab
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        borderRadius: "0.5rem",
        _hover: {
          bgColor: "gray.200",
        },
        _selected: {
          bgColor: "blue.500",
          color: "white",
          _hover: {
            bgColor: "blue.600",
          },
        },
        _dark: {
          borderColor: "gray.700",
          _hover: {
            bgColor: "gray.700",
          },
          _selected: {
            _hover: {
              bgColor: "blue.600",
            },
          },
        },
      }}
    >
      {children}
    </Tab>
  );
};

const ConfigTabList: React.FC = () => {
  const largerThanMD = useBreakpointValue([false, true]);

  return (
    <TabList
      sx={{
        borderRadius: "0.5rem",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray.200",
        width: largerThanMD ? "25%" : "100%",
        minWidth: "150px",
        _dark: {
          borderColor: "gray.700",
        },
      }}
    >
      <ConfigTab>形式設定</ConfigTab>
      <ConfigTab>プレイヤー設定</ConfigTab>
      <ConfigTab>その他の設定</ConfigTab>
    </TabList>
  );
};

export default ConfigTabList;
