import { useCallback, useState } from "react";
import { EventData } from "../types/events";
import { useGetEventSignUps, useGetEventLikes } from "./api/events-api";

function useProfileEventsState({
  userId,
  isLikesTabActive,
  isGoingTabActive,
  isPastTabActive,
}: {
  userId?: number;
  isLikesTabActive: boolean;
  isGoingTabActive: boolean;
  isPastTabActive: boolean;
}) {
  const { getEventSignUps } = useGetEventSignUps();
  const { getEventLikes } = useGetEventLikes();
  const [likedEvents, setLikedEvents] = useState<EventData[]>([]);
  const [goingEvents, setGoingEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);

  const getEvents = useCallback(async () => {
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
  }, [userId, getEventSignUps, getEventLikes]);

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

  return {
    getEvents,
    showingEvents,
    likedEvents,
    goingEvents,
    pastEvents,
  };
}

export default useProfileEventsState;
