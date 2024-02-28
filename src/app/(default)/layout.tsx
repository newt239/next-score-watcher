import { ToastContainer } from "react-toastify";

import Header from "./_components/Header";

import { css } from "@panda/css";

import "react-toastify/dist/ReactToastify.css";

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
          lg: {
            ml: "300px",
            mt: "0px",
          },
          maxW: "1300px",
          mt: "50px",
          p: "16px",
          w: "100%",
        })}
      >
        {children}
      </div>
      <ToastContainer />
    </div>
  );
}
