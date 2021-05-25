import { useContext, useEffect, useState } from "react";
import PlaceholderWrapper from "../placeholder-wrapper";
import NoEventBanner from "../no-event-banner";
import { SingleEventContext } from "../../context-providers";
import EventInfoView from "../event-info-view";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";

function EventBody() {
  const { event, getSingleEvent } = useContext(SingleEventContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getSingleEvent();
      setLoading(false);
    })();
  }, [getSingleEvent]);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving event"
      placeholder
      showDefaultContent={!event}
      defaultContent={<NoEventBanner />}
    >
      {event && (
        <PullToRefreshWrapper onRefresh={getSingleEvent}>
          <EventInfoView event={event} />
        </PullToRefreshWrapper>
      )}
    </PlaceholderWrapper>
  );
}

export default EventBody;
