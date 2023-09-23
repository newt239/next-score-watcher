import Header from "./_components/Header";

import { css } from "@panda/css";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          p: "16px",
          mt: "50px",
          maxW: "1300px",
          lg: {
            mt: "0px",
            ml: "300px",
          },
        })}
      >
        {children}
      </div>
    </div>
  );
}
