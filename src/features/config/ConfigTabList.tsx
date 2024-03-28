import { Tab, TabList } from "@chakra-ui/react";

import { css } from "@panda/css";

const ConfigTabList: React.FC = () => {
  return (
    <TabList
      className={css({
        borderRadius: "0.5rem",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray.200",
        /*
        button: {
          justifyContent: "flex-start",
        },
        "button:nth-of-type(1)": {
          borderRadius: "0.5rem 0.5rem 0 0",
        },
        "button:nth-last-of-type(1)": {
          borderRadius: "0 0 0.5rem 0.5rem",
        },
        "button:hover": {
          bgColor: "gray.200",
        },
        "button[aria-selected='true']": {
          bgColor: "blue.500",
          color: "white",
        },
        */
        _dark: {
          borderColor: "gray.700",
          /*
          "button:hover": {
            bgColor: "gray.700",
          },
          "button[aria-selected='true']": {
            bgColor: "blue.500",
            color: "white",
          },
          */
        },
      })}
      w={{ base: "100%", md: "25%" }}
    >
      <Tab>形式設定</Tab>
      <Tab>プレイヤー設定</Tab>
      <Tab>その他の設定</Tab>
    </TabList>
  );
};
export default ConfigTabList;
