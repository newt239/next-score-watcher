import { Outlet } from "react-router-dom";

import { css } from "@panda/css";
import Header from "~/features/components/Header";

const Layout: React.FC = () => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        lg: {
          flexDirection: "row",
        },
      })}
    >
      <Header />
      <div
        className={css({
          lg: {
            ml: 300,
            mt: 0,
          },
          maxW: "1300px",
          mt: 50,
          p: "16px",
          w: "100%",
        })}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
