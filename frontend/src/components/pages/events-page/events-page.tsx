import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PageBodyContext, SearchContext } from "../../../context-providers";
import { useGetEvents } from "../../../custom-hooks/api/events-api";
import { EventData } from "../../../types/events";
import EventList from "../../event-list";

function EventsPage() {
  const { pageBody } = useContext(PageBodyContext);
  const {
    searchQuery: { category, startDateTime, endDateTime },
  } = useContext(SearchContext);
  const [events, setEvents] = useState<EventData[]>([]);
  const { isLoading, getEvents } = useGetEvents();
  const eventListRef = useRef<ElementRef<typeof EventList>>(null);

  useEffect(() => {
    (async () => {
      setEvents([]);
      setEvents(await getEvents({ category, startDateTime, endDateTime }));
      eventListRef.current?.reupdateList();
    })();
  }, [getEvents, category, startDateTime, endDateTime]);

  const refreshEvents = useCallback(async () => {
    setEvents((await getEvents()).reverse());
    eventListRef.current?.reupdateList();
  }, [getEvents]);

  const getMoreEvents = useCallback(async () => {
    const moreEvents = await getEvents();
    setEvents((events) => events.concat(moreEvents));
  }, [getEvents]);

  return (
    <EventList
      ref={eventListRef}
      hasNextPage
      isNextPageLoading={isLoading}
      events={events}
      loadNextPage={getMoreEvents}
      refreshPage={refreshEvents}
      scrollElement={pageBody}
    />
  );
}

export default EventsPage;
