import { Container, Segment } from "semantic-ui-react";
import { capitalCase } from "change-case";
import TabsSection, { Tab } from "../tabs-section";
import VirtualizedPageBody from "../virtualized-page-body";
import EventInfoCommentsSection from "../event-info-comments-section";
import EventInfoMetaSection from "../event-info-meta-section";
import EventInfoDetailsSection from "../event-info-details-section";
import EventInfoParticipantsSection from "../event-info-participants-section";
import { COMMENTS, DETAILS, PARTICIPANTS } from "../../constants";
import { EventData } from "../../types/events";
import styles from "./event-info-view.module.scss";

type Props = {
  event: EventData;
};

function EventInfoView({
  event: {
    category,
    title,
    creator,
    createdAt,
    description,
    startDateTime,
    endDateTime,
    venue,
    signUps = [],
    likes = [],
    comments = [],
  },
}: Props) {
  const tabsSectionProps = (() => {
    const isShowingDetails = true;
    const isShowingParticipants = false;
    const isShowingComments = false;

    const tabs: Tab[] = [
      {
        key: DETAILS,
        label: capitalCase(DETAILS),
        icon: isShowingDetails ? (
          <i className="fas fa-info-circle icon" />
        ) : (
          <i className="far fa-info-circle icon" />
        ),
        isActive: isShowingDetails,
      },
      {
        key: PARTICIPANTS,
        label: capitalCase(PARTICIPANTS),
        icon: isShowingParticipants ? (
          <i className="fas fa-user-friends icon" />
        ) : (
          <i className="far fa-user-friends icon" />
        ),
        isActive: isShowingParticipants,
      },
      {
        key: COMMENTS,
        label: capitalCase(COMMENTS),
        icon: isShowingComments ? (
          <i className="fas fa-comments icon" />
        ) : (
          <i className="far fa-comments icon" />
        ),
        isActive: isShowingComments,
      },
    ];

    const onTabClick = (key: string) => {};
    return { tabs, onTabClick };
  })();

  return (
    <div className={styles.eventInfoView}>
      <Segment vertical>
        <Container>
          <EventInfoMetaSection
            category={category}
            title={title}
            creator={creator}
            createdAt={createdAt}
          />
        </Container>
      </Segment>

      <Segment vertical>
        <Container>
          <TabsSection {...tabsSectionProps} />
        </Container>
      </Segment>

      <div className={styles.contentContainer}>
        <Segment className={styles.detailsContainer} vertical>
          <Container>
            <EventInfoDetailsSection
              description={description}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              venue={venue}
            />
          </Container>
        </Segment>

        <Segment padded vertical>
          <EventInfoParticipantsSection signUps={signUps} likes={likes} />
        </Segment>

        <div className={styles.commentsContainer}>
          <VirtualizedPageBody>
            <Segment vertical>
              <Container>
                <EventInfoCommentsSection comments={comments} />
              </Container>
            </Segment>
          </VirtualizedPageBody>
        </div>
      </div>
    </div>
  );
}

export default EventInfoView;
