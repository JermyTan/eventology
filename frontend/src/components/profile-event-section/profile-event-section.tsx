import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Icon, Container, Segment } from "semantic-ui-react";

import PlaceholderWrapper from "../placeholder-wrapper";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import NoEventBanner from "../no-event-banner";
import EventSummaryCard from "../event-summary-card";
import TabsSection, { Tab } from "../tabs-section";
import VirtualizedList from "../virtualized-list";
import { PageBodyContext } from "../page-body";
import { LIKES, GOING, PAST } from "../../constants";
import useProfileEventsState from "../../custom-hooks/use-profile-events-state";

type Props = {
  userId?: number;
};

function ProfileEventSection({ userId }: Props) {
  const { pageBodyRef } = useContext(PageBodyContext);
  const virtualizedListRef = useRef<ElementRef<typeof VirtualizedList>>(null);
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const currentTabCategory = pathname.match(/[^/]*$/)?.[0];
  const isLikesTabActive = currentTabCategory === LIKES;
  const isGoingTabActive = currentTabCategory === GOING;
  const isPastTabActive = currentTabCategory === PAST;
  const { getEvents, showingEvents, likedEvents, goingEvents, pastEvents } =
    useProfileEventsState({
      userId,
      isLikesTabActive,
      isGoingTabActive,
      isPastTabActive,
    });

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

  useEffect(() => {
    if (userId !== undefined) {
      (async () => {
        setLoading(true);
        await getEvents();
        setLoading(false);
      })();
    }
  }, [userId, getEvents]);

  useEffect(() => {
    virtualizedListRef.current?.rerenderList();
  }, [showingEvents]);

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
              ref={virtualizedListRef}
              itemRenderer={eventSummaryCardRenderer}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  placeholder
                  showDefaultContent
                  defaultContent={<NoEventBanner />}
                />
              )}
              numItems={showingEvents.length}
              scrollElement={pageBodyRef.current ?? undefined}
              defaultRowHeight={350}
            />
          </PullToRefreshWrapper>
        </Container>
      </Segment>
    </PlaceholderWrapper>
  );
}

export default ProfileEventSection;
