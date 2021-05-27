import classNames from "classnames";
import { Sidebar, Segment, Icon, Divider } from "semantic-ui-react";
import isEqual from "lodash.isequal";
import SearchDateSection from "../search-date-section";
import styles from "./search-sidebar.module.scss";
import SearchCategorySection from "../search-category-section";
import useSearchQueryParams from "../../custom-hooks/use-search-query-params";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSidebarOpened } from "../../redux/slices/search-slice";

function SearchSidebar() {
  const { setSearchQuery } = useSearchQueryParams();
  const { isSidebarOpened, selectedDate, selectedCategory } = useAppSelector(
    ({ search: { isSidebarOpened, selectedDate, selectedCategory } }) => ({
      isSidebarOpened,
      selectedDate,
      selectedCategory,
    }),
    isEqual,
  );
  const dispatch = useAppDispatch();

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
    dispatch(setSidebarOpened(false));
  };

  return (
    <Sidebar
      className={styles.searchSidebar}
      animation="push"
      onHide={() => dispatch(setSidebarOpened(false))}
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
