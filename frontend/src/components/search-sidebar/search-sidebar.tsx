import { useContext } from "react";
import classNames from "classnames";
import { Sidebar, Segment, Icon, Divider } from "semantic-ui-react";
import SearchDateSection from "../search-date-section";
import styles from "./search-sidebar.module.scss";
import { SearchContext } from "../../context-providers";
import SearchCategorySection from "../search-category-section";
import useSearchQueryParams from "../../custom-hooks/use-search-query-params";

function SearchSidebar() {
  const { setSearchQuery } = useSearchQueryParams();
  const { isSidebarOpened, setSidebarOpened, selectedDate, selectedCategory } =
    useContext(SearchContext);

  const isValidSearch =
    selectedDate !== undefined && selectedCategory !== undefined;

  const onSearch = () => {
    if (!isValidSearch) {
      return;
    }

    const [startDateTime, endDateTime] = selectedDate?.split("-") ?? [];

    setSearchQuery({
      category: selectedCategory,
      startDateTime,
      endDateTime,
    });
    setSidebarOpened(false);
  };

  return (
    <Sidebar
      className={styles.searchSidebar}
      animation="push"
      onHide={() => setSidebarOpened(false)}
      visible={isSidebarOpened}
    >
      <Segment
        vertical
        className={classNames(styles.bodyContainer, styles.important)}
      >
        <div className={styles.searchInputSection}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              DATE
              <Divider className={styles.line} />
            </div>
          </div>

          <SearchDateSection />
        </div>

        <Divider hidden />

        <div className={styles.searchInputSection}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              CATEGORY
              <Divider className={styles.line} />
            </div>
          </div>

          <SearchCategorySection />
        </div>
      </Segment>

      <div
        className={classNames(
          styles.button,
          isValidSearch ? styles.enabled : styles.disabled,
        )}
        onClick={isValidSearch ? onSearch : undefined}
      >
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
