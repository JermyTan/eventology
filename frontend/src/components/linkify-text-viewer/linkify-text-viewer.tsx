import { ReactNode } from "react";
import Linkify from "react-linkify";

type Props = {
  children: ReactNode;
};

function LinkifyTextViewer({ children }: Props) {
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <a target="_blank" rel="noreferrer" href={decoratedHref} key={key}>
          {decoratedText}
        </a>
      )}
    >
      {children}
    </Linkify>
  );
}

export default LinkifyTextViewer;
