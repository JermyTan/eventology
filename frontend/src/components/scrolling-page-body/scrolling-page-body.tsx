import { forwardRef, ReactNode, Ref } from "react";
import styles from "./scrolling-page-body.module.scss";

type Props = {
  children: ReactNode;
};

function ScrollingPageBody({ children }: Props, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className={styles.scrollingPageBody}>
      {children}
    </div>
  );
}

export default forwardRef(ScrollingPageBody);
