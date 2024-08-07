"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import classes from "./Hamburger.module.css";

type Props = {
  children?: React.ReactNode;
};

// TODO: escape key to close menu

const Hamburger: React.FC<Props> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  useEffect(() => {
    if (opened) toggle();
  }, [pathname]);

  return (
    <>
      <Burger color="white" opened={opened} onClick={toggle} />
      {opened && <nav className={classes.burger_menu}>{children}</nav>}
    </>
  );
};

export default Hamburger;
