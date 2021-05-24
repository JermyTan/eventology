import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Container, Segment } from "semantic-ui-react";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import EventSummaryCard from "../event-summary-card";
import NoEventBanner from "../no-event-banner";
import PlaceholderWrapper from "../placeholder-wrapper";
import { PageBodyContext, SearchContext } from "../../context-providers";
import { useGetEvents } from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import VirtualizedList from "../virtualized-list";

function EventList() {
  const { pageBody } = useContext(PageBodyContext);
  const {
    searchQuery: { category, startDateTime, endDateTime },
  } = useContext(SearchContext);
  const [events, setEvents] = useState<EventData[]>([]);
  const { isLoading, getEvents } = useGetEvents();
  const virtualizedListRef = useRef<ElementRef<typeof VirtualizedList>>(null);

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
    virtualizedListRef.current?.rerenderList();
  }, [getEvents]);

  const getMoreEvents = useCallback(async () => {
    const moreEvents = await getEvents();
    setEvents((events) => events.concat(moreEvents));
  }, [getEvents]);

  const eventSummaryCardRenderer = useCallback(
    (index: number) => (
      <EventSummaryCard
        event={events[index]}
        onChange={(changes: Partial<EventData>) => {
          const updatedEvent = { ...events[index], ...changes };

          const updatedEvents = [...events];
          updatedEvents[index] = updatedEvent;

          setEvents(updatedEvents);
        }}
      />
    ),
    [events],
  );

  const loaderRenderer = useCallback(
    () => (
      <PlaceholderWrapper
        style={{ margin: "-1em 0" }}
        isLoading
        loadingMessage={events.length === 0 ? "Retrieving events" : undefined}
        placeholder={events.length === 0}
      />
    ),
    [events.length],
  );

  return (
    <Segment vertical>
      <Container>
        <PullToRefreshWrapper onRefresh={refreshEvents}>
          <VirtualizedList
            ref={virtualizedListRef}
            itemRenderer={eventSummaryCardRenderer}
            loaderRenderer={loaderRenderer}
            noRowsRenderer={() => (
              <PlaceholderWrapper
                placeholder
                showDefaultContent
                defaultContent={<NoEventBanner />}
              />
            )}
            hasNextPage
            isNextPageLoading={isLoading}
            numItems={events.length}
            loadNextPage={getMoreEvents}
            scrollElement={pageBody}
            defaultRowHeight={350}
          />
        </PullToRefreshWrapper>
      </Container>
    </Segment>
  );
}

export default EventList;
