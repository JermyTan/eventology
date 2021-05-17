import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type PageBodyContextType = {
  pageBody?: HTMLDivElement;
  setPageBody: Dispatch<SetStateAction<HTMLDivElement | undefined>>;
};

export const PageBodyContext = createContext<PageBodyContextType>({
  pageBody: undefined,
  setPageBody: () => {
    throw new Error("setPageBody is not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function PageBodyProvider({ children }: Props) {
  const [pageBody, setPageBody] = useState<HTMLDivElement>();

  return (
    <PageBodyContext.Provider value={{ pageBody, setPageBody }}>
      {children}
    </PageBodyContext.Provider>
  );
}

export default PageBodyProvider;
