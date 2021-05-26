import { useContext, useRef } from "react";
import { Container, Ref, Segment } from "semantic-ui-react";
import { capitalCase } from "change-case";
import classNames from "classnames";
import { useInView } from "react-intersection-observer";
import TabsSection, { Tab } from "../tabs-section";
import PageBody, { PageBodyContext } from "../page-body";
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
  const { pageBody } = useContext(PageBodyContext);
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const {
    ref: detailsSectionRef,
    inView: isDetailsSectionInView,
    entry: detailsSectionEntry,
  } = useInView({
    threshold: 0.5,
    root: pageBody,
  });
  const {
    ref: participantsSectionRef,
    inView: isParticipantsSectionInView,
    entry: participantsSectionEntry,
  } = useInView({ threshold: 0.5, root: pageBody });
  const {
    ref: commentsSectionRef,
    inView: isCommentsSectionInView,
    entry: commentsSectionEntry,
  } = useInView({ threshold: 0.5, root: pageBody });

  const tabsSectionProps = (() => {
    const tabs: Tab[] = [
      {
        key: DETAILS,
        label: capitalCase(DETAILS),
        icon: isDetailsSectionInView ? (
          <i className="fas fa-info-circle icon" />
        ) : (
          <i className="far fa-info-circle icon" />
        ),
        isActive: isDetailsSectionInView,
      },
      {
        key: PARTICIPANTS,
        label: capitalCase(PARTICIPANTS),
        icon: isParticipantsSectionInView ? (
          <i className="fas fa-user-friends icon" />
        ) : (
          <i className="far fa-user-friends icon" />
        ),
        isActive: isParticipantsSectionInView,
      },
      {
        key: COMMENTS,
        label: capitalCase(COMMENTS),
        icon: isCommentsSectionInView ? (
          <i className="fas fa-comments icon" />
        ) : (
          <i className="far fa-comments icon" />
        ),
        isActive: isCommentsSectionInView,
      },
    ];

    const scrollToTop = (top: number) =>
      pageBody?.scrollTo({ top, behavior: "smooth" });

    const onTabClick = (key: string) => {
      const tabsSectionHeight = tabsSectionRef.current?.offsetHeight;

      if (tabsSectionHeight === undefined) {
        return;
      }

      if (key === DETAILS && detailsSectionEntry?.target) {
        scrollToTop(
          (detailsSectionEntry.target as HTMLDivElement).offsetTop -
            tabsSectionHeight,
        );
        return;
      }

      if (key === PARTICIPANTS && participantsSectionEntry?.target) {
        scrollToTop(
          (participantsSectionEntry.target as HTMLDivElement).offsetTop -
            tabsSectionHeight,
        );
        return;
      }

      if (key === COMMENTS && commentsSectionEntry?.target) {
        scrollToTop(
          (commentsSectionEntry.target as HTMLDivElement).offsetTop -
            tabsSectionHeight,
        );
      }
    };

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

      <Ref innerRef={tabsSectionRef}>
        <Segment
          className={classNames(styles.tabsSection, styles.important)}
          vertical
        >
          <Container>
            <TabsSection {...tabsSectionProps} />
          </Container>
        </Segment>
      </Ref>

      <div className={styles.contentContainer}>
        <Ref innerRef={detailsSectionRef}>
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
        </Ref>

        <Ref innerRef={participantsSectionRef}>
          <Segment padded vertical>
            <EventInfoParticipantsSection signUps={signUps} likes={likes} />
          </Segment>
        </Ref>

        <div ref={commentsSectionRef} className={styles.commentsContainer}>
          <PageBody>
            <Segment vertical>
              <Container>
                <EventInfoCommentsSection comments={comments} />
              </Container>
            </Segment>
          </PageBody>
        </div>
      </div>
    </div>
  );
}

export default EventInfoView;
