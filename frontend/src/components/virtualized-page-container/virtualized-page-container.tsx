import { ReactNode } from "react";
import styles from "./virtualized-page-container.module.scss";

type Props = {
  children: ReactNode;
};

function VirtualizedPageContainer({ children }: Props) {
  return <div className={styles.virtualizedPageContainer}>{children}</div>;
}

export default VirtualizedPageContainer;
