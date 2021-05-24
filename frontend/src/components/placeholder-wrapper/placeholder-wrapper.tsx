import { CSSProperties, ReactNode } from "react";
import classNames from "classnames";
import { Segment, Loader, LoaderProps } from "semantic-ui-react";
import styles from "./placeholder-wrapper.module.scss";

type Props = {
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  showDefaultContent?: boolean;
  defaultContent?: ReactNode;
  inverted?: boolean;
  placeholder?: boolean;
  size?: LoaderProps["size"];
};

function PlaceholderWrapper({
  style,
  className,
  children = null,
  isLoading = false,
  loadingMessage,
  showDefaultContent = false,
  defaultContent,
  inverted = false,
  placeholder = false,
  size = "huge",
}: Props) {
  return isLoading || showDefaultContent ? (
    <Segment
      style={style}
      className={classNames(styles.placeholderWrapper, className)}
      basic
      placeholder={placeholder}
      textAlign="center"
    >
      {isLoading && (
        <Loader
          size={size}
          active
          inverted={inverted}
          inline
          content={loadingMessage}
        />
      )}
      {!isLoading && showDefaultContent && defaultContent}
    </Segment>
  ) : (
    <>{children}</>
  );
}

export default PlaceholderWrapper;
