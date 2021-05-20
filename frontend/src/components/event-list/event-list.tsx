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
import { Icon, Image } from "semantic-ui-react";
import PullToRefresh from "react-simple-pull-to-refresh";
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
  refreshPage: () => Promise<unknown>;
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
      refreshPage,
      scrollElement,
    }: Props,
    ref: Ref<EventListHandle>,
  ) => {
    const [eventCount, setEventCount] = useState(events.length);
    const [cellMeasurerCache] = useState(
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 350,
      }),
    );
    const listRef = useRef<List>(null) as MutableRefObject<List | null>;

    const rerenderList = useCallback(
      (index?: number) => {
        if (index === undefined) {
          cellMeasurerCache.clearAll();
        } else {
          cellMeasurerCache.clear(index, 0);
        }

        listRef.current?.recomputeRowHeights(index);
      },
      [cellMeasurerCache],
    );

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
      console.log(events.length, eventCount);
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
      (index: number, changes: Partial<EventData>) => {
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
          cache={cellMeasurerCache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={style}>
            {isRowLoaded({ index }) ? (
              <EventSummaryCard
                event={events[index]}
                onChange={(changes: Partial<EventData>) =>
                  updateEvents(index, changes)
                }
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
      [events, cellMeasurerCache, isRowLoaded, updateEvents],
    );

    return (
      <PullToRefresh
        isPullable
        onRefresh={refreshPage}
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
                      rowHeight={cellMeasurerCache.rowHeight}
                      deferredMeasurementCache={cellMeasurerCache}
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
                          defaultContent={
                            <PlaceholderWrapper
                              showDefaultContent
                              placeholder
                              defaultContent={
                                <div className={styles.noEventContentContainer}>
                                  <Image
                                    src={noActivityLogo}
                                    size="tiny"
                                    wrapped
                                  />
                                  <h3 className={styles.text}>
                                    No event found
                                  </h3>
                                </div>
                              }
                            />
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
      </PullToRefresh>
    );
  },
);

export default EventList;
