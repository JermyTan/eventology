import { Sidebar } from "semantic-ui-react";
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
import { getDatePeriods } from "../../../utils/date-time-utils";
import { startOfToday } from "date-fns";

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
        datePeriods: getDatePeriods({
          currentDateTime: startOfToday().getTime(),
        }),
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
    <Sidebar.Pushable>
      <SearchSidebar />

      <Sidebar.Pusher dimmed={isSidebarOpened}>
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
