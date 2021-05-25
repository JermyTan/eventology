import { useContext } from "react";
import { Container, Segment } from "semantic-ui-react";
import { capitalCase } from "change-case";
import TabsSection, { Tab } from "../tabs-section";
import VirtualizedPageBody from "../virtualized-page-body";
import EventInfoCommentsSection from "../event-info-comments-section";
import EventInfoMetaSection from "../event-info-meta-section";
import EventInfoDetailsSection from "../event-info-details-section";
import EventInfoParticipantsSection from "../event-info-participants-section";
import { COMMENTS, DETAILS, PARTICIPANTS } from "../../constants";
import { SingleEventContext } from "../../context-providers";
import styles from "./event-info-view.module.scss";

function EventInfoView() {
  const { event } = useContext(SingleEventContext);

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

  return event ? (
    <div className={styles.eventInfoView}>
      <Segment vertical>
        <Container>
          <EventInfoMetaSection
            category={event?.category}
            title={event.title}
            creator={event.creator}
            createdAt={event.createdAt}
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
              description={event.description}
              startDateTime={event.startDateTime}
              endDateTime={event.endDateTime}
              venue={event.venue}
            />
          </Container>
        </Segment>

        <Segment padded vertical>
          <EventInfoParticipantsSection
            signUps={event.signUps ?? []}
            likes={event.likes ?? []}
          />
        </Segment>

        <div className={styles.commentsContainer}>
          <VirtualizedPageBody>
            <Segment vertical>
              <Container>
                <EventInfoCommentsSection comments={event.comments ?? []} />
              </Container>
            </Segment>
          </VirtualizedPageBody>
        </div>
      </div>
    </div>
  ) : null;
}

export default EventInfoView;
