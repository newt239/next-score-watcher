"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Burger } from "@mantine/core";
import { useDisclosure, useWindowEvent } from "@mantine/hooks";
import { createPortal } from "react-dom";

import classes from "./Hamburger.module.css";

type Props = {
  children?: React.ReactNode;
};

const Hamburger: React.FC<Props> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  useEffect(() => {
    if (opened) toggle();
  }, [pathname]);

  useWindowEvent("keydown", (event) => {
    if (!window.location.pathname.endsWith("board")) {
      if (event.code === "Escape" && opened) {
        toggle();
      }
    }
  });

  const ModalContent = createPortal(
    <nav className={classes.burger_menu} data-show={opened} inert={!opened}>
      {children}
    </nav>,
    document.body
  );

  return (
    <>
      <Burger color="white" opened={opened} onClick={toggle} />
      {ModalContent}
    </>
  );
};

export default Hamburger;
