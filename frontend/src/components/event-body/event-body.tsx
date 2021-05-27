import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PlaceholderWrapper from "../placeholder-wrapper";
import NoEventBanner from "../no-event-banner";
import EventInfoView from "../event-info-view";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetSingleEvent } from "../../custom-hooks/api/events-api";
import { setEvent } from "../../redux/slices/single-event-slice";

function EventBody() {
  const event = useAppSelector(({ singleEvent }) => singleEvent.event);
  const dispatch = useAppDispatch();
  const { eventId } = useParams<{ eventId: string }>();
  const { isLoading, getSingleEvent } = useGetSingleEvent();

  useEffect(() => {
    (async () => {
      dispatch(setEvent(await getSingleEvent(eventId)));
    })();

    return () => {
      dispatch(setEvent(undefined));
    };
  }, [eventId, getSingleEvent, dispatch]);

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
