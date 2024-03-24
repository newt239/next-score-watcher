"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { css } from "@panda/css";

type TabState = {
  activeKey: string;
  addItem: (title: string, key: string) => void;
};

type TabValue = {
  title: string;
  key: string;
};

const TabContext = createContext<TabState>({
  activeKey: "",
  addItem: () => {},
});

type TabProps = {
  defaultKey: string;
};

export const Tab: React.FC<PropsWithChildren<TabProps>> = ({
  defaultKey,
  children,
}) => {
  const [activeKey, setActiveKey] = useState(defaultKey);
  const [tabs, setTabs] = useState<TabValue[]>([]);
  const addTab = useCallback((title: string, key: string) => {
    setTabs((tabs) => {
      if (tabs.findIndex((item) => item.key === key) >= 0) {
        return tabs;
      } else {
        return [...tabs, { key, title }];
      }
    });
  }, []);

  const state = useMemo<TabState>(
    () => ({
      activeKey,
      addItem: addTab,
    }),
    [activeKey, tabs]
  );

  return (
    <TabContext.Provider value={state}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          my: "16px",
          w: "100%",
        })}
      >
        <div
          className={css({
            borderBottomColor: "emerald.500",
            borderBottomWidth: "2px",
            display: "flex",
            gap: "16px",
          })}
          role="tablist"
        >
          {tabs.map(({ title, key }) => (
            <button
              aria-selected={activeKey === key}
              className={css({
                _hover: {
                  backgroundColor: "emerald.500",
                  color: "white",
                },
                _selected: {
                  backgroundColor: "emerald.500",
                  color: "white",
                },
                backgroundColor: "white",
                borderColor: "emerald.500",
                borderRadius: "8px 8px 0 0",
                borderWidth: "2px 2px 0 2px",
                color: "emerald.500",
                cursor: "pointer",
                padding: "8px 16px",
                transition: "all 0.2s ease",
              })}
              key={key}
              onClick={() => setActiveKey(key)}
              role="tab"
            >
              {title}
            </button>
          ))}
        </div>
        <div
          className={css({
            py: "16px",
          })}
        >
          {children}
        </div>
      </div>
    </TabContext.Provider>
  );
};

type TabItemProps = {
  tabKey: string;
  title: string;
};

export const TabItem: React.FC<PropsWithChildren<TabItemProps>> = ({
  title,
  tabKey,
  children,
}) => {
  const { activeKey, addItem } = useContext(TabContext);

  useLayoutEffect(() => {
    addItem(title, tabKey);
  }, []);

  return tabKey === activeKey ? <>{children}</> : null;
};
