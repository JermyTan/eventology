import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon, Container } from "semantic-ui-react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { PageBodyContext, SearchContext } from "../../../context-providers";
import { useGetEvents } from "../../../custom-hooks/api/events-api";
import PlaceholderWrapper from "../../placeholder-wrapper";
import { EventData } from "../../../types/events";
import EventList from "../../event-list";
import styles from "./events-page.module.scss";

function EventsPage() {
  const { pageBody } = useContext(PageBodyContext);
  const {
    searchQuery: { category, startDateTime, endDateTime },
  } = useContext(SearchContext);
  const [events, setEvents] = useState<EventData[]>([]);
  const { isLoading, getEvents } = useGetEvents();
  const eventListRef = useRef<ElementRef<typeof EventList>>(null);

  useEffect(() => {
    setEvents([]);

    if (category || startDateTime || endDateTime) {
      (async () => {
        setEvents(await getEvents({ category, startDateTime, endDateTime }));
      })();
    }
  }, [getEvents, category, startDateTime, endDateTime]);

  const refreshEvents = useCallback(async () => {
    setEvents((await getEvents()).reverse());
    eventListRef.current?.rerenderList();
  }, [getEvents]);

  const getMoreEvents = useCallback(async () => {
    const moreEvents = await getEvents();
    setEvents((events) => events.concat(moreEvents));
  }, [getEvents]);

  const onUpdateEvent = useCallback(
    (index: number) => (changes: Partial<EventData>) => {
      const updatedEvent = { ...events[index], ...changes };

      const updatedEvents = [...events];
      updatedEvents[index] = updatedEvent;

      setEvents(updatedEvents);
    },
    [events],
  );

  return (
    <Container>
      <PullToRefresh
        isPullable
        onRefresh={refreshEvents}
        pullingContent={
          <PlaceholderWrapper
            showDefaultContent
            defaultContent={
              <h3 className={styles.pullingContentContainer}>
                <Icon name="arrow down" fitted /> Pull down to refresh{" "}
                <Icon name="arrow down" fitted />
              </h3>
            }
          />
        }
      >
        <EventList
          ref={eventListRef}
          hasNextPage
          isNextPageLoading={isLoading}
          events={events}
          onUpdateEvent={onUpdateEvent}
          loadNextPage={getMoreEvents}
          scrollElement={pageBody}
        />
      </PullToRefresh>
    </Container>
  );
}

export default EventsPage;
