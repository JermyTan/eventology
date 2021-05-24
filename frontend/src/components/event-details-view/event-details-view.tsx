import { memo, useCallback, useState } from "react";
import classNames from "classnames";
import {
  Container,
  Segment,
  Label,
  Image,
  Icon,
  Grid,
  Popup,
  Divider,
  Ref,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { capitalCase } from "change-case";
import TabsSection, { Tab } from "../tabs-section";
import LinkifyTextViewer from "../linkify-text-viewer";
import { PROFILE_MAIN_PATH } from "../../routes/paths";
import VirtualizedList from "../virtualized-list";
import Comment from "../comment";
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
  USER_ID,
} from "../../constants";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-details-view.module.scss";

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
    venue,
    signUps = [],
    likes = [],
    comments: temp = [],
  },
}: Props) {
  const history = useHistory();
  const [commentsContainer, setCommentsContainer] =
    useState<HTMLElement | null>(null);

  const onUserClickGenerator = (userId: number) => () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${userId}`));

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

  const comments = temp.flatMap((comment) => Array(50).fill(comment));

  const commentRenderer = useCallback(
    (index: number) => <Comment comment={comments[index]} />,
    [comments],
  );

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
              onClick={onUserClickGenerator(creator.id)}
              src={defaultAvatarImage}
              alt=""
              avatar
              bordered
              size="mini"
              className={styles.pointer}
            />

            <div>
              <div
                onClick={onUserClickGenerator(creator.id)}
                className={classNames(styles.name, styles.pointer)}
              >
                {creator.name}
              </div>
              <div className={styles.publishedDateTime}>
                {displayDateTime(createdAt, RELATIVE)}
              </div>
            </div>
          </div>
        </Container>
      </Segment>

      <TabsSection {...tabsSectionProps} />

      <div className={styles.contentContainer}>
        <Segment className={styles.detailsContainer} vertical>
          <Container>
            <Segment vertical>
              <div className={styles.description}>
                <LinkifyTextViewer>{description}</LinkifyTextViewer>
              </div>
            </Segment>

            <Segment className={styles.dateTimeSection} vertical>
              <h3 className={styles.sectionHeader}>
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

                    <div>
                      {displayDateTime(endDateTime, TIME_PERIOD_FORMAT)}
                    </div>
                  </div>
                </Segment>
              </div>
            </Segment>

            <Segment className={styles.venueSection} vertical>
              <h3 className={styles.sectionHeader}>
                <div className={styles.verticalBar} />
                <div className={styles.label}>Where</div>
              </h3>

              <h4 className={styles.venue}>{venue}</h4>
              <iframe
                title="Venue map"
                className={styles.map}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=${"AIzaSyAWRrV5klHlGZu_mwPvYqnSXc2WBPrIuhc"}&q=${venue}`}
              />
            </Segment>
          </Container>
        </Segment>

        <Segment padded className={styles.participantsContainer} vertical>
          <Grid columns="2" container>
            <Grid.Row>
              <Grid.Column
                className={styles.label}
                computer="2"
                tablet="3"
                mobile="4"
              >
                <Icon className={styles.icon} name="check" />
                {signUps.length} going
              </Grid.Column>

              <Grid.Column computer="14" tablet="13" mobile="12">
                {signUps
                  .flatMap((signUp) => Array(50).fill(signUp))
                  .map(({ user: { id, name } }) => (
                    <Popup
                      key={id}
                      content={name}
                      trigger={
                        <Image
                          onClick={onUserClickGenerator(id)}
                          src={defaultAvatarImage}
                          alt=""
                          avatar
                          bordered
                          size="mini"
                          className={styles.pointer}
                        />
                      }
                      position="top center"
                      on="hover"
                    />
                  ))}
              </Grid.Column>
            </Grid.Row>

            <Divider className={styles.horizontalDivider} />

            <Grid.Row>
              <Grid.Column
                className={styles.label}
                computer="2"
                tablet="3"
                mobile="4"
              >
                <Icon className={styles.icon} name="heart outline" />
                {likes.length} likes
              </Grid.Column>

              <Grid.Column computer="14" tablet="13" mobile="12">
                {likes
                  .flatMap((signUp) => Array(50).fill(signUp))
                  .map(({ user: { id, name } }) => (
                    <Popup
                      key={id}
                      content={name}
                      trigger={
                        <Image
                          onClick={onUserClickGenerator(id)}
                          src={defaultAvatarImage}
                          alt=""
                          avatar
                          bordered
                          size="mini"
                          className={styles.pointer}
                        />
                      }
                      position="top center"
                      on="hover"
                    />
                  ))}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Ref innerRef={setCommentsContainer}>
          <Segment className={styles.commentsContainer} vertical>
            <Container>
              <VirtualizedList
                itemRenderer={commentRenderer}
                dividerRenderer={() => (
                  <Divider className={styles.commentDivider} hidden />
                )}
                numItems={comments.length}
                scrollElement={commentsContainer ?? undefined}
                defaultRowHeight={100}
              />
            </Container>
          </Segment>
        </Ref>
      </div>
    </div>
  );
}

export default memo(EventDetailsView);
