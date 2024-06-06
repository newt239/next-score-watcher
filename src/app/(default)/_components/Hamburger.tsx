"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

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
      <Burger opened={opened} onClick={toggle} />
      {opened && (
        <nav className="fixed left-0 top-16 w-full bg-white p-2">
          {children}
        </nav>
      )}
    </>
  );
};

export default Hamburger;
