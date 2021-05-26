import {
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import styles from "./page-body.module.scss";

type PageBodyContextType = {
  pageBody: HTMLDivElement | null;
  setPageBody: Dispatch<SetStateAction<HTMLDivElement | null>>;
};

export const PageBodyContext = createContext<PageBodyContextType>({
  pageBody: null,
  setPageBody: () => {
    throw new Error("setPageBody is not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function PageBody({ children }: Props) {
  const [pageBody, setPageBody] = useState<HTMLDivElement | null>(null);

  return (
    <div className={styles.pageBody} ref={setPageBody}>
      <div className={styles.innerPageBody}>
        <PageBodyContext.Provider value={{ pageBody, setPageBody }}>
          {children}
        </PageBodyContext.Provider>
      </div>
    </div>
  );
}

export default PageBody;
