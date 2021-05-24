import { ReactNode, useContext } from "react";
import { PageBodyContext, PageBodyProvider } from "../../context-providers";
import styles from "./virtualized-page-body.module.scss";

type Props = {
  children: ReactNode;
};

const PageBody = ({ children }: Props) => {
  const { setPageBody } = useContext(PageBodyContext);

  return (
    <div
      className={styles.virtualizedPageBody}
      ref={(pageBody) => setPageBody(pageBody ?? undefined)}
    >
      <div>{children}</div>
    </div>
  );
};

function VirtualizedPageBody({ children }: Props) {
  return (
    <PageBodyProvider>
      <PageBody>{children}</PageBody>
    </PageBodyProvider>
  );
}

export default VirtualizedPageBody;
