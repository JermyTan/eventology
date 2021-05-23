import { useCallback, useContext, useEffect, useState } from "react";
import { Container, Segment } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import PlaceholderWrapper from "../placeholder-wrapper";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import NoEventBanner from "../no-event-banner";
import EventSummaryCard from "../event-summary-card";
import {
  useGetEventLikes,
  useGetEventSignUps,
} from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import ProfileTabSection from "../profile-tabs-section";
import VirtualizedList from "../virtualized-list";
import { PageBodyContext } from "../../context-providers";
import { LIKES, GOING, PAST } from "../../constants";

type Props = {
  userId?: number;
};

function ProfileEventSection({ userId }: Props) {
  const { pageBody } = useContext(PageBodyContext);
  const { getEventSignUps } = useGetEventSignUps();
  const { getEventLikes } = useGetEventLikes();
  const [isLoading, setLoading] = useState(false);
  const [likedEvents, setLikedEvents] = useState<EventData[]>([]);
  const [goingEvents, setGoingEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const { pathname } = useLocation();
  const currentTabCategory = pathname.match(/[^/]*$/)?.[0];
  const isLikesTabActive = currentTabCategory === LIKES;
  const isGoingTabActive = currentTabCategory === GOING;
  const isPastTabActive = currentTabCategory === PAST;
  const showingEvents = (() => {
    if (isLikesTabActive) {
      return likedEvents;
    }

    if (isGoingTabActive) {
      return goingEvents;
    }

    if (isPastTabActive) {
      return pastEvents;
    }

    return [];
  })();

  const getEvents = useCallback(async () => {
    setLoading(true);

    const likedEventsPromise = (async () => {
      const likedEvents = (
        await getEventLikes({
          userId,
          eventDetails: true,
        })
      ).flatMap(({ event }) => (event ? [event] : []));

      setLikedEvents(likedEvents);
    })();

    const goingAndPastEventsPromise = (async () => {
      const signedUpEvents = (
        await getEventSignUps({
          userId,
          eventDetails: true,
        })
      ).flatMap(({ event }) => (event ? [event] : []));

      const currentDateTime = new Date().getTime();
      const goingEvents = signedUpEvents.filter(
        ({ endDateTime }) => endDateTime >= currentDateTime,
      );
      const pastEvents = signedUpEvents.filter(
        ({ endDateTime }) => endDateTime < currentDateTime,
      );

      setGoingEvents(goingEvents);
      setPastEvents(pastEvents);
    })();

    await Promise.allSettled([likedEventsPromise, goingAndPastEventsPromise]);

    setLoading(false);
  }, [userId, getEventSignUps, getEventLikes]);

  useEffect(() => {
    if (userId !== undefined) {
      getEvents();
    }
  }, [userId, getEvents]);

  const itemRenderer = useCallback(
    (index: number) => (
      <EventSummaryCard event={showingEvents[index]} onChange={getEvents} />
    ),
    [showingEvents, getEvents],
  );

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving events"
      placeholder
    >
      <ProfileTabSection
        numLikedEvents={likedEvents.length}
        numGoingEvents={goingEvents.length}
        numPastEvents={pastEvents.length}
        isLikesTabActive={isLikesTabActive}
        isGoingTabActive={isGoingTabActive}
        isPastTabActive={isPastTabActive}
      />

      <Segment vertical>
        <Container>
          <PullToRefreshWrapper onRefresh={getEvents}>
            <VirtualizedList
              itemRenderer={itemRenderer}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  placeholder
                  showDefaultContent
                  defaultContent={<NoEventBanner />}
                />
              )}
              numItems={showingEvents.length}
              scrollElement={pageBody}
              defaultRowHeight={350}
            />
          </PullToRefreshWrapper>
        </Container>
      </Segment>
    </PlaceholderWrapper>
  );
}

export default ProfileEventSection;
