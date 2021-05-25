import { ReactNode, useContext } from "react";
import { PageBodyContext, PageBodyProvider } from "../../context-providers";
import ScrollingPageBody from "../scrolling-page-body";

type Props = {
  children: ReactNode;
};

const PageBody = ({ children }: Props) => {
  const { setPageBody } = useContext(PageBodyContext);

  return (
    <ScrollingPageBody ref={setPageBody}>
      <div>{children}</div>
    </ScrollingPageBody>
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
