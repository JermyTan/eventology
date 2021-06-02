import { Sidebar } from "semantic-ui-react";
import classNames from "classnames";
import EventList from "../../event-list";
import TopBar from "../../top-bar";
import PageBody from "../../page-body";
import FullPageContainer from "../../full-page-container";
import SearchSidebar from "../../search-sidebar";
import SearchTab from "../../search-tab";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  loadCategories,
  loadDates,
  setLoadingCategories,
  setSidebarOpened,
} from "../../../redux/slices/search-slice";
import { useGetEventCategories } from "../../../custom-hooks/api/events-api";
import useSearchQueryParams from "../../../custom-hooks/use-search-query-params";
import styles from "./events-page.module.scss";

function EventsPage() {
  const { getEventCategories } = useGetEventCategories();
  const isSidebarOpened = useAppSelector(
    ({ search }) => search.isSidebarOpened,
  );
  const dispatch = useAppDispatch();
  const { searchQuery } = useSearchQueryParams();

  const onClickSearchTab = async () => {
    dispatch(setSidebarOpened(true));
    dispatch(
      loadDates({
        searchQuery,
      }),
    );
    dispatch(setLoadingCategories(true));

    const categories = await getEventCategories();

    dispatch(
      loadCategories({
        categories,
        searchQuery,
      }),
    );
    dispatch(setLoadingCategories(false));
  };

  return (
    <Sidebar.Pushable className={styles.eventsPage}>
      <SearchSidebar />

      <Sidebar.Pusher
        className={classNames(styles.pusherContainer, styles.important)}
        dimmed={isSidebarOpened}
      >
        <FullPageContainer>
          <TopBar leftTab={<SearchTab onTabClick={onClickSearchTab} />} />

          <PageBody>
            <EventList />;
          </PageBody>
        </FullPageContainer>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default EventsPage;
