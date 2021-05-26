import FullPageContainer from "../../full-page-container";
import TopBar from "../../top-bar";
import EventBody from "../../event-body/event-body";
import BottomBar from "../../bottom-bar";
import PageBody from "../../page-body";

function EventsSingleViewPage() {
  return (
    <FullPageContainer>
      <TopBar />

      <PageBody>
        <EventBody />
      </PageBody>

      <BottomBar />
    </FullPageContainer>
  );
}

export default EventsSingleViewPage;
