import FullPageContainer from "../../full-page-container";
import TopBar from "../../top-bar";
import EventBody from "../../event-body/event-body";
import BottomBar from "../../bottom-bar";
import ScrollingPageBody from "../../scrolling-page-body";

function EventsSingleViewPage() {
  return (
    <FullPageContainer>
      <TopBar />

      <ScrollingPageBody>
        <EventBody />
      </ScrollingPageBody>

      <BottomBar />
    </FullPageContainer>
  );
}

export default EventsSingleViewPage;
