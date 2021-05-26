import { useContext, useEffect, useState } from "react";
import PlaceholderWrapper from "../placeholder-wrapper";
import NoEventBanner from "../no-event-banner";
import { SingleEventContext } from "../../context-providers";
import EventInfoView from "../event-info-view";

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
      {event && <EventInfoView event={event} />}
    </PlaceholderWrapper>
  );
}

export default EventBody;
