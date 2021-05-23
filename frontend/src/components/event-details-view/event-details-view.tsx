import { Container, Segment, Label, Image } from "semantic-ui-react";
import { capitalCase } from "change-case";
import { EventData } from "../../types/events";
import { displayDateTime } from "../../utils/parser-utils";
import {
  COMMENTS,
  DETAILS,
  PARTICIPANTS,
  RELATIVE,
  DATE_FORMAT,
  TIME_FORMAT,
  TIME_PERIOD_FORMAT,
} from "../../constants";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-details-view.module.scss";
import TabsSection, { Tab } from "../tabs-section";
import LinkifyTextViewer from "../linkify-text-viewer";

type Props = {
  event: EventData;
};

function EventDetailsView({
  event: {
    category,
    title,
    creator,
    createdAt,
    description,
    startDateTime,
    endDateTime,
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
    <div className={styles.eventDetailsView}>
      <Segment vertical>
        <Container className={styles.meta}>
          {category && (
            <Label className={styles.category} basic circular>
              {category}
            </Label>
          )}

          <div className={styles.title}>
            <h1>{title}</h1>
          </div>

          <div className={styles.userInfo}>
            <Image
              src={defaultAvatarImage}
              alt=""
              avatar
              bordered
              size="mini"
            />

            <div>
              <div className={styles.name}>{creator.name}</div>
              <div className={styles.publishedDateTime}>
                {displayDateTime(createdAt, RELATIVE)}
              </div>
            </div>
          </div>
        </Container>
      </Segment>

      <TabsSection {...tabsSectionProps} />

      <div className={styles.contentContainer}>
        <Container>
          <Segment vertical>
            <div className={styles.description}>
              <LinkifyTextViewer>{description}</LinkifyTextViewer>
            </div>
          </Segment>

          <Segment className={styles.dateTimeSection} vertical>
            <h3 className={styles.header}>
              <div className={styles.verticalBar} />
              <div className={styles.label}>When</div>
            </h3>

            <div className={styles.periodContainer}>
              <Segment className={styles.dateTimeContainer} vertical>
                <h3 className={styles.dateContainer}>
                  <span className={styles.iconContainer}>
                    <i className="far fa-arrow-from-left icon" />
                  </span>
                  {displayDateTime(startDateTime, DATE_FORMAT)}
                </h3>

                <div className={styles.timeContainer}>
                  <h1 className={styles.time}>
                    {displayDateTime(startDateTime, TIME_FORMAT)}
                  </h1>

                  <div>
                    {displayDateTime(startDateTime, TIME_PERIOD_FORMAT)}
                  </div>
                </div>
              </Segment>

              <div className={styles.verticalDivider} />

              <Segment className={styles.dateTimeContainer} vertical>
                <h3 className={styles.dateContainer}>
                  <span className={styles.iconContainer}>
                    <i className="far fa-arrow-from-right icon" />
                  </span>
                  {displayDateTime(endDateTime, DATE_FORMAT)}
                </h3>

                <div className={styles.timeContainer}>
                  <h1 className={styles.time}>
                    {displayDateTime(endDateTime, TIME_FORMAT)}
                  </h1>

                  <div>{displayDateTime(endDateTime, TIME_PERIOD_FORMAT)}</div>
                </div>
              </Segment>
            </div>
          </Segment>

          <Segment vertical />
        </Container>
      </div>
    </div>
  );
}

export default EventDetailsView;
