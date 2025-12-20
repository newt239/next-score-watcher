import { Flex } from "@mantine/core";

import Header from "./_components/Header/Header";
import classes from "./layout.module.css";

export const dynamic = "force-static";

const DefaultLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Flex className={classes.wrapper}>
      <Header />
      <div className={classes.under_header}></div>
      <main className={classes.main}>{children}</main>
    </Flex>
  );
};

export default DefaultLayout;
