import classNames from "classnames";
import { Sidebar, Segment, Icon, Divider } from "semantic-ui-react";
import isEqual from "lodash.isequal";
import SearchDateSection from "../search-date-section";
import SearchCategorySection from "../search-category-section";
import useSearchQueryParams from "../../custom-hooks/use-search-query-params";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSidebarOpened } from "../../redux/slices/search-slice";
import { displaySearchedEventCategoryAndDateTime } from "../../utils/parser-utils";
import { DATE_PERIOD_SEPARATOR } from "../../constants";
import styles from "./search-sidebar.module.scss";

function SearchSidebar() {
  const { setSearchQuery } = useSearchQueryParams();
  const { isSidebarOpened, selectedDatePeriod, selectedCategory } =
    useAppSelector(
      ({
        search: { isSidebarOpened, selectedDatePeriod, selectedCategory },
      }) => ({
        isSidebarOpened,
        selectedDatePeriod,
        selectedCategory,
      }),
      isEqual,
    );
  const dispatch = useAppDispatch();
  const [startDateTime, endDateTime] = selectedDatePeriod.split(
    DATE_PERIOD_SEPARATOR,
  );

  const onSearch = () => {
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
        className={classNames(styles.button, styles.enabled)}
        onClick={onSearch}
      >
        <h4 className={styles.title}>
          <Icon name="search" />
          SEARCH
        </h4>

        <div className={styles.subtitle}>
          {displaySearchedEventCategoryAndDateTime({
            category: selectedCategory,
            startDateTime,
            endDateTime,
          })}
        </div>
      </div>
    </Sidebar>
  );
}

export default SearchSidebar;
