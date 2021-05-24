import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlaceholderWrapper from "../../placeholder-wrapper";
import NoEventBanner from "../../no-event-banner";
import { useGetSingleEvent } from "../../../custom-hooks/api/events-api";
import { EVENT_ID } from "../../../constants";
import VirtualizedList from "../../virtualized-list";
import { PageBodyContext } from "../../../context-providers";
import EventDetailsView from "../../event-details-view";

function EventsSingleViewPage() {
  const { pageBody } = useContext(PageBodyContext);
  const { eventId } = useParams<{ [EVENT_ID]: string }>();
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();

  useEffect(() => {
    getSingleEvent(eventId);
  }, [eventId, getSingleEvent]);

  const eventDetailsViewRenderer = useCallback(
    () => (event ? <EventDetailsView event={event} /> : undefined),
    [event],
  );

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving event"
      placeholder
      showDefaultContent={!event}
      defaultContent={<NoEventBanner />}
    >
      <VirtualizedList
        itemRenderer={eventDetailsViewRenderer}
        numItems={event ? 1 : 0}
        scrollElement={pageBody}
        defaultRowHeight={800}
      />
    </PlaceholderWrapper>
  );
}

export default EventsSingleViewPage;
