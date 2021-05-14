import { useCallback, useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useGetEvents } from "../../../custom-hooks/api/events-api";
import { EventData } from "../../../types/events";
import PlaceholderWrapper from "../../placeholder-wrapper";
import styles from "./events-page.module.scss";

function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const { getEvents } = useGetEvents();
  const [isInitialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      setEvents(await getEvents());
      setInitialLoading(false);
    })();
  }, [getEvents]);

  const refreshEvents = useCallback(async () => {
    const result = await getEvents();
    setEvents((events) => events.concat(result));
  }, [getEvents]);

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
          {events.map((event) => (
            <p>{JSON.stringify(event)}</p>
          ))}
        </>
      </PullToRefresh>
    </PlaceholderWrapper>
  );
}

export default EventsPage;
