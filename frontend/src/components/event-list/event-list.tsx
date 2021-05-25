import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { Container, Segment } from "semantic-ui-react";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import EventSummaryCard from "../event-summary-card";
import NoEventBanner from "../no-event-banner";
import PlaceholderWrapper from "../placeholder-wrapper";
import { PageBodyContext } from "../../context-providers";
import { useGetEvents } from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import VirtualizedList from "../virtualized-list";
import styles from "./event-list.module.scss";
import useSearchQueryParams from "../../custom-hooks/use-search-query-params";

function EventList() {
  const { pageBody } = useContext(PageBodyContext);
  const {
    searchQuery: { category, startDateTime, endDateTime },
  } = useSearchQueryParams();
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
        onChange={(changes: Partial<EventData>) =>
          setEvents((events) => {
            const updatedEvent = { ...events[index], ...changes };

            const updatedEvents = [...events];
            updatedEvents[index] = updatedEvent;

            return updatedEvents;
          })
        }
      />
    ),
    [events],
  );

  const loaderRenderer = useCallback(
    () => (
      <PlaceholderWrapper
        className={classNames(
          events.length === 0 && styles.loader,
          events.length === 0 && styles.important,
        )}
        isLoading
        loadingMessage={events.length === 0 ? "Retrieving events" : undefined}
        placeholder={events.length === 0}
      />
    ),
    [events.length],
  );

  return (
    <Segment className={styles.eventList} vertical>
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
            scrollElement={pageBody ?? undefined}
            defaultRowHeight={350}
          />
        </PullToRefreshWrapper>
      </Container>
    </Segment>
  );
}

export default EventList;
