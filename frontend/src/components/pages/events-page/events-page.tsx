import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Container, Icon } from "semantic-ui-react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInView } from "react-intersection-observer";
import {
  AutoSizer,
  List,
  ListRowRenderer,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";
import { useGetEvents } from "../../../custom-hooks/api/events-api";
import { EventData } from "../../../types/events";
import PlaceholderWrapper from "../../placeholder-wrapper";
import EventSummaryCard from "../../event-summary-card";
import styles from "./events-page.module.scss";
import { PageBodyContext } from "../../../context-providers";

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 350,
});

function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const { isLoading, getEvents } = useGetEvents();
  const [isInitialLoading, setInitialLoading] = useState(false);
  const { ref, inView } = useInView();
  const listRef = useRef<List>(null);
  const { pageBody } = useContext(PageBodyContext);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      const events = await getEvents();
      setEvents(
        events //.slice(1, 2)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events)
          .concat(events),
      );
      setInitialLoading(false);
    })();
  }, [getEvents]);

  useEffect(() => {
    if (!isLoading && inView) {
      (async () => {
        const moreEvents = await getEvents();
        setEvents((events) => events.concat(moreEvents));
      })();
    }
  }, [isLoading, inView, getEvents]);

  const refreshEvents = useCallback(async () => {
    setEvents(await getEvents());
  }, [getEvents]);

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, parent, key, style }) => {
      return (
        <CellMeasurer
          key={key}
          cache={cellMeasurerCache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={style}>
            <EventSummaryCard {...events[index]} />
          </div>
        </CellMeasurer>
      );
    },
    [events],
  );

  return (
    <PlaceholderWrapper
      isLoading={isInitialLoading}
      loadingMessage="Retrieving events"
      showDefaultContent={events.length === 0}
      defaultContent={
        <h2 className={styles.defaultContentContainer}>No event found</h2>
      }
      placeholder
    >
      <PullToRefresh
        isPullable
        onRefresh={refreshEvents}
        pullingContent={
          <PlaceholderWrapper
            showDefaultContent
            defaultContent={
              <h3 className={styles.defaultContentContainer}>
                <Icon name="arrow down" fitted /> Pull down to refresh{" "}
                <Icon name="arrow down" fitted />
              </h3>
            }
          />
        }
        pullDownThreshold={80}
        maxPullDownDistance={120}
      >
        <WindowScroller scrollElement={pageBody}>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer
              onResize={() => {
                cellMeasurerCache.clearAll();
                listRef.current?.recomputeRowHeights();
              }}
              disableHeight
            >
              {({ width }) => (
                <List
                  autoHeight
                  ref={listRef}
                  height={height}
                  width={width}
                  rowHeight={cellMeasurerCache.rowHeight}
                  deferredMeasurementCache={cellMeasurerCache}
                  rowRenderer={rowRenderer}
                  rowCount={events.length}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  overscanRowCount={3}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
        {/* <PlaceholderWrapper isLoading={isLoading}>
            <div ref={ref} />
      </PlaceholderWrapper> */}
      </PullToRefresh>
    </PlaceholderWrapper>
  );
}

export default EventsPage;
