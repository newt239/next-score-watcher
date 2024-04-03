import { Tab, TabList } from "@chakra-ui/react";

import { css } from "@panda/css";

const ConfigTab: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Tab
      className={css({
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
      })}
    >
      {children}
    </Tab>
  );
};

const ConfigTabList: React.FC = () => {
  return (
    <TabList
      className={css({
        borderRadius: "0.5rem",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray.200",
        width: "100%",
        md: {
          width: "25%",
          minWidth: "150px",
        },
      })}
    >
      <ConfigTab>形式設定</ConfigTab>
      <ConfigTab>プレイヤー設定</ConfigTab>
      <ConfigTab>その他の設定</ConfigTab>
    </TabList>
  );
};
export default ConfigTabList;
