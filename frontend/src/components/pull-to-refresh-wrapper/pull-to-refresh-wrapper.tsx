import { ReactNode } from "react";
import { Icon } from "semantic-ui-react";
import PullToRefresh from "react-simple-pull-to-refresh";
import PlaceholderWrapper from "../placeholder-wrapper";
import styles from "./pull-to-refresh-wrapper.module.scss";

type Props = {
  onRefresh: () => Promise<unknown>;
  pullingContent?: string | JSX.Element | undefined;
  children: ReactNode;
};

function PullToRefreshWrapper({ children, onRefresh, pullingContent }: Props) {
  return (
    <PullToRefresh
      isPullable
      onRefresh={onRefresh}
      pullingContent={
        pullingContent ?? (
          <PlaceholderWrapper
            showDefaultContent
            defaultContent={
              <h3 className={styles.pullingContentContainer}>
                <Icon name="arrow down" fitted /> Pull down to refresh{" "}
                <Icon name="arrow down" fitted />
              </h3>
            }
          />
        )
      }
    >
      <>{children}</>
    </PullToRefresh>
  );
}

export default PullToRefreshWrapper;
