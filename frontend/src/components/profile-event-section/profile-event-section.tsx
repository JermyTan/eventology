import { useCallback, useContext, useEffect, useState } from "react";
import { Container, Segment, Icon } from "semantic-ui-react";
import { useHistory, useLocation } from "react-router-dom";
import PlaceholderWrapper from "../placeholder-wrapper";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import NoEventBanner from "../no-event-banner";
import EventSummaryCard from "../event-summary-card";
import {
  useGetEventLikes,
  useGetEventSignUps,
} from "../../custom-hooks/api/events-api";
import { EventData } from "../../types/events";
import TabsSection, { Tab } from "../tabs-section";
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
  const history = useHistory();
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

  const tabsSectionProps = (() => {
    const tabs: Tab[] = [
      {
        key: LIKES,
        label: `${likedEvents.length} Likes`,
        icon: isLikesTabActive ? (
          <Icon name="heart" />
        ) : (
          <Icon name="heart outline" />
        ),
        isActive: isLikesTabActive,
      },
      {
        key: GOING,
        label: `${goingEvents.length} Going`,
        icon: <Icon name="check" />,
        isActive: isGoingTabActive,
      },
      {
        key: PAST,
        label: `${pastEvents.length} Past`,
        icon: isPastTabActive ? (
          <i className="fas fa-paw icon" />
        ) : (
          <i className="far fa-paw icon" />
        ),
        isActive: isPastTabActive,
      },
    ];

    const onTabClick = (key: string) => {
      if (currentTabCategory === key) {
        return;
      }

      // matches last part of url
      history.push(pathname.replace(/[^/]*$/, key));
    };
    return { tabs, onTabClick };
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

  const eventSummaryCardRenderer = useCallback(
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
      <Segment vertical>
        <Container>
          <TabsSection {...tabsSectionProps} />
        </Container>
      </Segment>

      <Segment vertical>
        <Container>
          <PullToRefreshWrapper onRefresh={getEvents}>
            <VirtualizedList
              itemRenderer={eventSummaryCardRenderer}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  placeholder
                  showDefaultContent
                  defaultContent={<NoEventBanner />}
                />
              )}
              numItems={showingEvents.length}
              scrollElement={pageBody ?? undefined}
              defaultRowHeight={350}
            />
          </PullToRefreshWrapper>
        </Container>
      </Segment>
    </PlaceholderWrapper>
  );
}

export default ProfileEventSection;
