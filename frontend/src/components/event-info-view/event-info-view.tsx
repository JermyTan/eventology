import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Container, Ref, Segment } from "semantic-ui-react";
import { capitalCase } from "change-case";
import classNames from "classnames";
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
    id: eventId,
    category,
    title,
    creator,
    createdAt,
    images,
    description,
    startDateTime,
    endDateTime,
    venue,
    signUps = [],
    likes = [],
    comments = [],
  },
}: Props) {
  const { pageBodyRef } = useContext(PageBodyContext);
  const currentPageRef = useRef<HTMLDivElement>(null);
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const participantsSectionRef = useRef<HTMLDivElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const [isDetailsSectionInView, setDetailsSectionInView] = useState(false);
  const [isParticipantsSectionInView, setParticipantsSectionInView] =
    useState(false);
  const [isCommentsSectionInView, setCommentsSectionInView] = useState(false);

  const getSectionsPositions = useCallback(() => {
    const tabsSectionHeight = tabsSectionRef.current?.offsetHeight ?? 0;
    const detailsSectionPosition =
      (detailsSectionRef.current?.offsetTop ?? 0) - tabsSectionHeight;
    const participantsSectionPosition =
      (participantsSectionRef.current?.offsetTop ?? 0) - tabsSectionHeight;
    const commentsSectionPosition =
      (commentsSectionRef.current?.offsetTop ?? 0) - tabsSectionHeight;

    return {
      detailsSectionPosition,
      participantsSectionPosition,
      commentsSectionPosition,
    };
  }, []);

  useEffect(() => {
    const pageBody = pageBodyRef.current;

    const onChange = () => {
      if (!pageBody) {
        return;
      }

      const {
        detailsSectionPosition,
        participantsSectionPosition,
        commentsSectionPosition,
      } = getSectionsPositions();

      if (
        pageBody.scrollTop <=
        Math.max(
          detailsSectionPosition,
          participantsSectionPosition - pageBody.offsetHeight / 5,
        )
      ) {
        setDetailsSectionInView(true);
        setParticipantsSectionInView(false);
        setCommentsSectionInView(false);
      } else if (
        pageBody.scrollTop <
          (currentPageRef.current?.offsetHeight ?? 0) - pageBody.offsetHeight &&
        pageBody.scrollTop <=
          Math.max(
            participantsSectionPosition,
            commentsSectionPosition - pageBody.offsetHeight / 5,
          )
      ) {
        setDetailsSectionInView(false);
        setParticipantsSectionInView(true);
        setCommentsSectionInView(false);
      } else {
        setDetailsSectionInView(false);
        setParticipantsSectionInView(false);
        setCommentsSectionInView(true);
      }
    };
    onChange();
    pageBody?.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange, { passive: true });

    return () => {
      pageBody?.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [getSectionsPositions, pageBodyRef]);

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
      pageBodyRef.current?.scrollTo({ top, behavior: "smooth" });

    const onTabClick = (key: string) => {
      const {
        detailsSectionPosition,
        participantsSectionPosition,
        commentsSectionPosition,
      } = getSectionsPositions();

      switch (key) {
        case DETAILS:
          scrollToTop(detailsSectionPosition);
          break;
        case PARTICIPANTS:
          scrollToTop(participantsSectionPosition);
          break;
        case COMMENTS:
          scrollToTop(commentsSectionPosition);
          break;
      }
    };

    return { tabs, onTabClick };
  })();

  return (
    <div ref={currentPageRef} className={styles.eventInfoView}>
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
                images={images}
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
                <EventInfoCommentsSection
                  eventId={eventId}
                  comments={comments}
                />
              </Container>
            </Segment>
          </PageBody>
        </div>
      </div>
    </div>
  );
}

export default memo(EventInfoView);
