import { Tab, TabList } from "@chakra-ui/react";

import useDeviceWidth from "#/hooks/useDeviceWidth";

const ConfigTabList: React.FC = () => {
  const isDesktop = useDeviceWidth();

  return (
    <TabList
      sx={{
        w: isDesktop ? "30%" : "100%",
        borderRadius: "0.5rem",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray.200",
        button: {
          justifyContent: "flex-start",
        },
        "button:nth-child(1)": {
          borderRadius: "0.5rem 0.5rem 0 0",
        },
        "button:nth-last-child(1)": {
          borderRadius: "0 0 0.5rem 0.5rem",
        },
        "button:hover": {
          bgColor: "gray.200",
        },
        "button[aria-selected='true']": {
          bgColor: "blue.500",
          color: "white",
        },
        _dark: {
          borderColor: "gray.700",
          "button:hover": {
            bgColor: "gray.700",
          },
          "button[aria-selected='true']": {
            bgColor: "blue.500",
            color: "white",
          },
        },
      }}
    >
      <Tab>形式設定</Tab>
      <Tab>プレイヤー設定</Tab>
      <Tab>その他の設定</Tab>
    </TabList>
  );
};
export default ConfigTabList;
