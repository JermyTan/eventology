import { Dispatch, SetStateAction } from "react";
import classNames from "classnames";
import { Sidebar, Segment, Icon, Divider } from "semantic-ui-react";
import SearchDateSection from "../search-date-section";
import styles from "./search-sidebar.module.scss";

type Props = {
  isSidebarOpened: boolean;
  setSidebarOpened: Dispatch<SetStateAction<boolean>>;
};

function SearchSidebar({ isSidebarOpened, setSidebarOpened }: Props) {
  return (
    <Sidebar
      className={styles.searchSidebar}
      animation="push"
      onHide={() => setSidebarOpened(false)}
      vertical
      visible={isSidebarOpened}
    >
      <Segment vertical className={styles.bodyContainer}>
        <div className={styles.dateSection}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              DATE
              <Divider className={styles.line} />
            </div>
          </div>

          <SearchDateSection />
        </div>

        <Divider hidden section />

        <div className={styles.dateSection}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              CATEGORY
              <Divider className={styles.line} />
            </div>
          </div>
        </div>
      </Segment>

      <div className={classNames(styles.button, styles.enabled)}>
        <h4 className={styles.title}>
          <Icon name="search" />
          SEARCH
        </h4>

        <div className={styles.subtitle}>All activities</div>
      </div>
    </Sidebar>
  );
}

export default SearchSidebar;
