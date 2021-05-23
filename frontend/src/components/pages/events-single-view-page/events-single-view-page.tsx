import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlaceholderWrapper from "../../placeholder-wrapper";
import NoEventBanner from "../../no-event-banner";
import { useGetSingleEvent } from "../../../custom-hooks/api/events-api";
import { EVENT_ID } from "../../../constants";
import VirtualizedList from "../../virtualized-list";
import { PageBodyContext } from "../../../context-providers";

function EventsSingleViewPage() {
  const { pageBody } = useContext(PageBodyContext);
  const { eventId } = useParams<{ [EVENT_ID]: string }>();
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();

  useEffect(() => {
    getSingleEvent(eventId);
  }, [eventId, getSingleEvent]);

  const itemRenderer = useCallback(() => {
    return <div>{event?.id}</div>;
  }, [event]);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving event"
      placeholder
      showDefaultContent={!event}
      defaultContent={<NoEventBanner />}
    >
      <VirtualizedList
        itemRenderer={itemRenderer}
        numItems={1}
        scrollElement={pageBody}
        defaultRowHeight={800}
      />
    </PlaceholderWrapper>
  );
}

export default EventsSingleViewPage;
