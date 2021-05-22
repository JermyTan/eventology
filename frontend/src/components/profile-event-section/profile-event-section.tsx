import { useCallback, useContext, useEffect, useState } from "react";
import { Container, Segment } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import PlaceholderWrapper from "../placeholder-wrapper";
import {
  useGetEventLikes,
  useGetEventSignUps,
} from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import ProfileTabSection from "../profile-tabs-section";
import EventList from "../event-list";
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

  const onUpdateEvent = useCallback(() => getEvents, [getEvents]);

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
          <EventList
            events={showingEvents}
            onUpdateEvent={onUpdateEvent}
            scrollElement={pageBody}
          />
        </Container>
      </Segment>
    </PlaceholderWrapper>
  );
}

export default ProfileEventSection;
