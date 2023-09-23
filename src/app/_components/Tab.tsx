import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

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
        return [...tabs, { title, key }];
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
      <div className="tab-wrap">
        {tabs.map(({ title, key }) => (
          <div
            className={`tab-item ${activeKey === key ? "active" : ""}`}
            key={key}
            onClick={() => setActiveKey(key)}
          >
            {title}
          </div>
        ))}
      </div>
      {children}
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
