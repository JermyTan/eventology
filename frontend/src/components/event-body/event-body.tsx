import { useCallback, useContext, useEffect, useState } from "react";
import PlaceholderWrapper from "../placeholder-wrapper";
import NoEventBanner from "../no-event-banner";
import VirtualizedList from "../virtualized-list";
import { PageBodyContext, SingleEventContext } from "../../context-providers";
import EventDetailsView from "../event-details-view";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";

function EventBody() {
  const { pageBody } = useContext(PageBodyContext);
  const { event, getSingleEvent } = useContext(SingleEventContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getSingleEvent();
      setLoading(false);
    })();
  }, [getSingleEvent]);

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
      <PullToRefreshWrapper onRefresh={getSingleEvent}>
        <VirtualizedList
          itemRenderer={eventDetailsViewRenderer}
          numItems={event ? 1 : 0}
          scrollElement={pageBody}
          defaultRowHeight={800}
        />
      </PullToRefreshWrapper>
    </PlaceholderWrapper>
  );
}

export default EventBody;
