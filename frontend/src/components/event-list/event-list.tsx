import {
  Dispatch,
  ElementRef,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import memoize from "lodash.memoize";
import { Container, Segment } from "semantic-ui-react";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import EventSummaryCard from "../event-summary-card";
import NoEventBanner from "../no-event-banner";
import PlaceholderWrapper from "../placeholder-wrapper";
import { PageBodyContext } from "../page-body";
import { useGetEvents } from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import VirtualizedList from "../virtualized-list";
import useSearchQueryParams from "../../custom-hooks/use-search-query-params";
import useFunctionCacheCleaner from "../../custom-hooks/use-function-cache-cleaner";

const onChangeGenerator = memoize(
  (index: number, setEvents: Dispatch<SetStateAction<EventData[]>>) =>
    (changes: Partial<EventData>) =>
      setEvents((events) => {
        const updatedEvent = { ...events[index], ...changes };

        const updatedEvents = [...events];
        updatedEvents[index] = updatedEvent;

        return updatedEvents;
      }),
);

const noRowsRenderer = () => (
  <PlaceholderWrapper
    placeholder
    showDefaultContent
    defaultContent={<NoEventBanner />}
  />
);

const loaderRenderer = () => <PlaceholderWrapper isLoading />;

const LIMIT = 10;

function EventList() {
  const { pageBodyRef } = useContext(PageBodyContext);
  const {
    searchQuery: { category, startDateTime, endDateTime },
  } = useSearchQueryParams();
  const [events, setEvents] = useState<EventData[]>([]);
  useFunctionCacheCleaner(onChangeGenerator, 20, events.length);
  const { isLoading: isNextPageLoading, getEvents } = useGetEvents();
  const [isLoading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [offset, setOffset] = useState(0);
  const virtualizedListRef = useRef<ElementRef<typeof VirtualizedList>>(null);

  const getMoreEvents = async () => {
    let moreEvents = await getEvents({ offset, limit: LIMIT });

    if (moreEvents.length === 0) {
      setOffset(0);
      moreEvents = await getEvents({ offset: 0, limit: LIMIT });
    }

    setOffset((offset) => offset + LIMIT);
    setEvents((events) => events.concat(moreEvents));
  };

  const refreshEvents = useCallback(async () => {
    setOffset(0);

    if (category || startDateTime || endDateTime) {
      setHasNextPage(false);
      setEvents(await getEvents({ category, startDateTime, endDateTime }));
    } else {
      setHasNextPage(true);
      setEvents(await getEvents({ offset: 0, limit: LIMIT }));
      setOffset((offset) => offset + LIMIT);
    }

    virtualizedListRef.current?.rerenderList();
  }, [getEvents, category, startDateTime, endDateTime]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshEvents();
      setLoading(false);
    })();
  }, [refreshEvents]);

  const eventSummaryCardRenderer = useCallback(
    (index: number) => (
      <EventSummaryCard
        event={events[index]}
        onChange={onChangeGenerator(index, setEvents)}
      />
    ),
    [events],
  );

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving events"
      placeholder
    >
      <Segment vertical>
        <Container>
          <PullToRefreshWrapper onRefresh={refreshEvents}>
            <VirtualizedList
              ref={virtualizedListRef}
              itemRenderer={eventSummaryCardRenderer}
              loaderRenderer={loaderRenderer}
              noRowsRenderer={noRowsRenderer}
              hasNextPage={hasNextPage}
              isNextPageLoading={isNextPageLoading}
              numItems={events.length}
              loadNextPage={getMoreEvents}
              scrollElement={pageBodyRef.current ?? undefined}
              defaultRowHeight={350}
              cachePreviousRowHeight
            />
          </PullToRefreshWrapper>
        </Container>
      </Segment>
    </PlaceholderWrapper>
  );
}

export default EventList;
