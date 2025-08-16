import type { ReactNode } from "react";

import ViewerHeader from "./_components/ViewerHeader/ViewerHeader";
import styles from "./layout.module.css";

const ViewerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.container}>
      <ViewerHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default ViewerLayout;
