import VirtualizedPageContainer from "../../virtualized-page-container";
import TopBar from "../../top-bar";
import VirtualizedPageBody from "../../virtualized-page-body";
import EventBody from "../../event-body/event-body";
import BottomBar from "../../bottom-bar";

function EventsSingleViewPage() {
  return (
    <VirtualizedPageContainer>
      <TopBar />

      <VirtualizedPageBody>
        <EventBody />
      </VirtualizedPageBody>

      <BottomBar />
    </VirtualizedPageContainer>
  );
}

export default EventsSingleViewPage;
