import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  Ref,
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
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  events: EventData[];
  onUpdateEvent?: (index: number) => (changes: Partial<EventData>) => void;
  loadNextPage?: (params: IndexRange) => Promise<unknown>;
  scrollElement?: Element;
};

type EventListHandle = {
  rerenderList: (index?: number) => void;
};

const defaultLoadNextPage = () => new Promise<unknown>(() => {});

function EventList(
  {
    hasNextPage = false,
    isNextPageLoading = false,
    events,
    onUpdateEvent,
    loadNextPage = defaultLoadNextPage,
    scrollElement,
  }: Props,
  ref: Ref<EventListHandle>,
) {
  const listRef = useRef<List>(null) as MutableRefObject<List | null>;
  const previousRowCountRef = useRef(0);
  const cellMeasurerCacheRef = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 350,
    }),
  );

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

  const rowCount = hasNextPage ? events.length + 1 : events.length;

  const loadMoreRows = isNextPageLoading ? defaultLoadNextPage : loadNextPage;

  const isRowLoaded = useCallback(
    (params: Index) => !hasNextPage || params.index < events.length,
    [hasNextPage, events.length],
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
              onChange={onUpdateEvent?.(index)}
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
    [events, isRowLoaded, onUpdateEvent],
  );

  useEffect(() => {
    if (events.length === 0) {
      rerenderList();
    }
  }, [events.length, rerenderList]);

  useEffect(() => {
    if (
      previousRowCountRef.current !== 0 &&
      events.length >= previousRowCountRef.current
    ) {
      console.log(previousRowCountRef.current, events.length);
      rerenderList(previousRowCountRef.current - 1);
    }

    previousRowCountRef.current = rowCount;
  }, [rowCount, events.length, rerenderList]);

  return (
    <InfiniteLoader
      rowCount={rowCount}
      isRowLoaded={isRowLoaded}
      threshold={0}
      loadMoreRows={loadMoreRows}
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
                  rowCount={rowCount}
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
}

export default forwardRef(EventList);
