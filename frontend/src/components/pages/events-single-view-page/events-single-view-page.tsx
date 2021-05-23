import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "semantic-ui-react";
import PlaceholderWrapper from "../../placeholder-wrapper";
import NoEventBanner from "../../no-event-banner";
import { useGetSingleEvent } from "../../../custom-hooks/api/events-api";
import { EVENT_ID } from "../../../constants";

function EventsSingleViewPage() {
  const { eventId } = useParams<{ [EVENT_ID]: string }>();
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();

  useEffect(() => {
    getSingleEvent(eventId);
  }, [eventId, getSingleEvent]);

  return (
    <Container>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving event"
        placeholder
        showDefaultContent={!event}
        defaultContent={<NoEventBanner />}
      >
        <h1>This is the events single view page for event {eventId}</h1>
      </PlaceholderWrapper>
    </Container>
  );
}

export default EventsSingleViewPage;
