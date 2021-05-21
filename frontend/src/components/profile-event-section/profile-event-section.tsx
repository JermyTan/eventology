import { useEffect, useState } from "react";
import PlaceholderWrapper from "../placeholder-wrapper";
import {
  useGetEventLikes,
  useGetEventSignUps,
} from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import ProfileTabSection from "../profile-tabs-section";

type Props = {
  userId?: number;
};

function ProfileEventSection({ userId }: Props) {
  const { getEventSignUps } = useGetEventSignUps();
  const { getEventLikes } = useGetEventLikes();
  const [isLoading, setLoading] = useState(false);
  const [signedUpEvents, setSignedUpEvents] = useState<EventData[]>([]);
  const [likedEvents, setLikedEvents] = useState<EventData[]>([]);

  const currentDateTime = new Date().getTime();
  const goingEvents = signedUpEvents.filter(
    ({ endDateTime }) => endDateTime >= currentDateTime,
  );
  const pastEvents = signedUpEvents.filter(
    ({ endDateTime }) => endDateTime < currentDateTime,
  );

  useEffect(() => {
    if (userId !== undefined) {
      const getSignedUpEvents = async () => {
        const eventSignUps = await getEventSignUps({
          userId,
          eventDetails: true,
        });

        const signedUpEvents = eventSignUps.flatMap(({ event }) =>
          event ? [event] : [],
        );

        setSignedUpEvents(signedUpEvents);
      };

      const getLikedEvents = async () => {
        const eventLikes = await getEventLikes({
          userId,
          eventDetails: true,
        });

        const likedEvents = eventLikes.flatMap(({ event }) =>
          event ? [event] : [],
        );

        setLikedEvents(likedEvents);
      };

      (async () => {
        setLoading(true);
        await Promise.allSettled([getSignedUpEvents(), getLikedEvents()]);
        setLoading(false);
      })();
    }
  }, [userId, getEventSignUps, getEventLikes]);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving events"
      placeholder
    >
      <ProfileTabSection
        likedEvents={likedEvents}
        goingEvents={goingEvents}
        pastEvents={pastEvents}
      />

      <div />
    </PlaceholderWrapper>
  );
}

export default ProfileEventSection;
