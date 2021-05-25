import { useCallback, useContext, useEffect, useState } from "react";
import PlaceholderWrapper from "../placeholder-wrapper";
import NoEventBanner from "../no-event-banner";
import VirtualizedList from "../virtualized-list";
import { PageBodyContext, SingleEventContext } from "../../context-providers";
import EventInfoView from "../event-info-view";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";

function EventBody() {
  const { pageBody } = useContext(PageBodyContext);
  const { event, getSingleEvent, setEventList } =
    useContext(SingleEventContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getSingleEvent();
      setLoading(false);
    })();
  }, [getSingleEvent]);

  const eventInfoViewRenderer = useCallback(
    () => (event ? <EventInfoView event={event} /> : undefined),
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
          ref={setEventList}
          itemRenderer={eventInfoViewRenderer}
          numItems={event ? 1 : 0}
          scrollElement={pageBody ?? undefined}
          defaultRowHeight={800}
        />
      </PullToRefreshWrapper>
    </PlaceholderWrapper>
  );
}

export default EventBody;
