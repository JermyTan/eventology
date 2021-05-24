import { useContext } from "react";
import { Sidebar } from "semantic-ui-react";
import { SearchContext } from "../../../context-providers";
import EventList from "../../event-list";
import TopBar from "../../top-bar";
import VirtualizedPageBody from "../../virtualized-page-body";
import VirtualizedPageContainer from "../../virtualized-page-container";
import SearchSidebar from "../../search-sidebar";
import SearchTab from "../../search-tab";

function EventsPage() {
  const { isSidebarOpened, setSidebarOpened } = useContext(SearchContext);

  return (
    <Sidebar.Pushable>
      <SearchSidebar />

      <Sidebar.Pusher dimmed={isSidebarOpened}>
        <VirtualizedPageContainer>
          <TopBar
            leftTab={<SearchTab onTabClick={() => setSidebarOpened(true)} />}
          />

          <VirtualizedPageBody>
            <EventList />;
          </VirtualizedPageBody>
        </VirtualizedPageContainer>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default EventsPage;
