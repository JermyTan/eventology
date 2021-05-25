import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

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

function PageBodyProvider({ children }: Props) {
  const [pageBody, setPageBody] = useState<HTMLDivElement | null>(null);

  return (
    <PageBodyContext.Provider value={{ pageBody, setPageBody }}>
      {children}
    </PageBodyContext.Provider>
  );
}

export default PageBodyProvider;
