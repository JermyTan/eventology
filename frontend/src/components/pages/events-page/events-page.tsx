import { useCallback, useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInView } from "react-intersection-observer";
import { useGetEvents } from "../../../custom-hooks/api/events-api";
import { EventData } from "../../../types/events";
import PlaceholderWrapper from "../../placeholder-wrapper";
import EventSummaryCard from "../../event-summary-card";
import styles from "./events-page.module.scss";

function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const { isLoading, getEvents } = useGetEvents();
  const [isInitialLoading, setInitialLoading] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      setEvents(await getEvents());
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

  console.log("rerender");

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
        <>
          {events.map((event, index) => (
            <EventSummaryCard key={index} {...event} />
          ))}
          <PlaceholderWrapper isLoading={isLoading}>
            <div ref={ref} />
          </PlaceholderWrapper>
        </>
      </PullToRefresh>
    </PlaceholderWrapper>
  );
}

export default EventsPage;
