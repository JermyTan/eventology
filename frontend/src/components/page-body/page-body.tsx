import { ReactNode, createContext, createRef, RefObject, useRef } from "react";
import styles from "./page-body.module.scss";

type PageBodyContextType = {
  pageBodyRef: RefObject<HTMLDivElement>;
};

export const PageBodyContext = createContext<PageBodyContextType>({
  pageBodyRef: createRef<HTMLDivElement>(),
});

type Props = {
  children: ReactNode;
};

function PageBody({ children }: Props) {
  const pageBodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.pageBody} ref={pageBodyRef}>
      <div className={styles.innerPageBody}>
        <PageBodyContext.Provider value={{ pageBodyRef }}>
          {children}
        </PageBodyContext.Provider>
      </div>
    </div>
  );
}

export default PageBody;
