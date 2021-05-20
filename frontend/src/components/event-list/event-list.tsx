import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  Ref,
  Dispatch,
  SetStateAction,
} from "react";
import {
  AutoSizer,
  List,
  ListRowRenderer,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
  InfiniteLoader,
  IndexRange,
  Index,
} from "react-virtualized";
import { Image } from "semantic-ui-react";
import EventSummaryCard from "../event-summary-card";
import PlaceholderWrapper from "../placeholder-wrapper";
import { EventData } from "../../types/events";
import noActivityLogo from "../../assets/no-activity-purple.svg";
import styles from "./event-list.module.scss";

type Props = {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  events: EventData[];
  setEvents: Dispatch<SetStateAction<EventData[]>>;
  loadNextPage: (params: IndexRange) => Promise<unknown>;
  scrollElement?: Element;
};

type EventListHandle = {
  rerenderList: (index?: number) => void;
};

const EventList = forwardRef(
  (
    {
      hasNextPage,
      isNextPageLoading,
      events,
      setEvents,
      loadNextPage,
      scrollElement,
    }: Props,
    ref: Ref<EventListHandle>,
  ) => {
    const [eventCount, setEventCount] = useState(events.length);
    const cellMeasurerCacheRef = useRef(
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 350,
      }),
    );
    const listRef = useRef<List>(null) as MutableRefObject<List | null>;

    const rerenderList = useCallback((index?: number) => {
      if (index === undefined) {
        cellMeasurerCacheRef.current.clearAll();
      } else {
        cellMeasurerCacheRef.current.clear(index, 0);
      }

      listRef.current?.recomputeRowHeights(index);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        rerenderList,
      }),
      [rerenderList],
    );

    useEffect(() => {
      if (events.length === 0) {
        rerenderList();
      }
    }, [events.length, rerenderList]);

    useEffect(() => {
      if (eventCount !== 0 && events.length >= eventCount) {
        rerenderList(eventCount - 1);
      }

      setEventCount(hasNextPage ? events.length + 1 : events.length);
    }, [eventCount, hasNextPage, events.length, rerenderList]);

    const loadMoreEvents = useMemo(
      () =>
        isNextPageLoading ? () => new Promise<unknown>(() => {}) : loadNextPage,
      [isNextPageLoading, loadNextPage],
    );

    const isRowLoaded = useCallback(
      (params: Index) => !hasNextPage || params.index < events.length,
      [hasNextPage, events.length],
    );

    const updateEvents = useCallback(
      (index: number) => (changes: Partial<EventData>) => {
        const updatedEvent = { ...events[index], ...changes };

        const updatedEvents = [...events];
        updatedEvents[index] = updatedEvent;

        setEvents(updatedEvents);
      },
      [events, setEvents],
    );

    const rowRenderer: ListRowRenderer = useCallback(
      ({ index, parent, key, style }) => (
        <CellMeasurer
          key={key}
          cache={cellMeasurerCacheRef.current}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={style}>
            {isRowLoaded({ index }) ? (
              <EventSummaryCard
                event={events[index]}
                onChange={updateEvents(index)}
              />
            ) : (
              <PlaceholderWrapper
                isLoading
                loadingMessage={
                  events.length === 0 ? "Retrieving events" : undefined
                }
                placeholder={events.length === 0}
              />
            )}
          </div>
        </CellMeasurer>
      ),
      [events, isRowLoaded, updateEvents],
    );

    return (
      <InfiniteLoader
        rowCount={eventCount}
        isRowLoaded={isRowLoaded}
        threshold={0}
        loadMoreRows={loadMoreEvents}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller scrollElement={scrollElement}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer onResize={() => rerenderList()} disableHeight>
                {({ width }) => (
                  <List
                    autoHeight
                    ref={(element) => {
                      registerChild(element);
                      listRef.current = element;
                    }}
                    height={height}
                    width={width}
                    rowHeight={cellMeasurerCacheRef.current.rowHeight}
                    deferredMeasurementCache={cellMeasurerCacheRef.current}
                    rowRenderer={rowRenderer}
                    rowCount={eventCount}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    overscanRowCount={5}
                    onRowsRendered={onRowsRendered}
                    noRowsRenderer={() => (
                      <PlaceholderWrapper
                        showDefaultContent
                        placeholder
                        defaultContent={
                          <div className={styles.noEventContentContainer}>
                            <Image src={noActivityLogo} size="tiny" wrapped />
                            <h3 className={styles.text}>No event found</h3>
                          </div>
                        }
                      />
                    )}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  },
);

export default EventList;
