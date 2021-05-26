import { memo, useState } from "react";
import { Label, Icon, Popup, Image } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ProgressiveImage from "react-progressive-graceful-image";
import classNames from "classnames";
import { EventData } from "../../types/events";
import { displayDateTime } from "../../utils/parser-utils";
import LinkifyTextViewer from "../linkify-text-viewer";
import {
  useCreateEventSignUp,
  useCreateEventLike,
  useDeleteEventSignUp,
  useDeleteEventLike,
} from "../../custom-hooks/api/events-api";
import IconLoader from "../icon-loader";
import { resolveApiError } from "../../utils/error-utils";
import { EVENTS_SINGLE_VIEW_PATH, PROFILE_MAIN_PATH } from "../../routes/paths";
import { EVENT_ID, USER_ID } from "../../constants";
import placeholderImage from "../../assets/placeholder-image.gif";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-summary-card.module.scss";

type Props = {
  event: EventData;
  onChange?: (changes: Partial<EventData>) => Promise<unknown> | unknown;
};

function EventSummaryCard({
  event: {
    id,
    title,
    creator,
    category,
    images,
    startDateTime,
    endDateTime,
    description,
    signUpCount,
    likeCount,
    hasSignedUp,
    hasLiked,
  },
  onChange,
}: Props) {
  const history = useHistory();
  const { createEventSignUp } = useCreateEventSignUp();
  const { createEventLike } = useCreateEventLike();
  const { deleteEventSignUp } = useDeleteEventSignUp();
  const { deleteEventLike } = useDeleteEventLike();
  const [isSigningUp, setSigningUp] = useState(false);
  const [isLiking, setLiking] = useState(false);
  const [isWithdrawing, setWithdrawing] = useState(false);
  const [isUnliking, setUnliking] = useState(false);

  const onCreateEventSignUp = async () => {
    if (isSigningUp || isWithdrawing) {
      return;
    }

    try {
      setSigningUp(true);

      const { event: updatedEvent } = await createEventSignUp({
        eventId: id,
      });

      await onChange?.({ ...updatedEvent });

      toast.success("You have joined for the event.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      setSigningUp(false);
    }
  };

  const onCreateEventLike = async () => {
    if (isLiking || isUnliking) {
      return;
    }

    try {
      setLiking(true);
      const { event: updatedEvent } = await createEventLike({ eventId: id });

      await onChange?.({ ...updatedEvent });

      toast.success("You have liked the event.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      setLiking(false);
    }
  };

  const onDeleteEventSignUp = async () => {
    if (isSigningUp || isWithdrawing) {
      return;
    }

    try {
      setWithdrawing(true);
      const { event: updatedEvent } = await deleteEventSignUp({
        eventId: id,
      });

      await onChange?.({ ...updatedEvent });

      toast.success("You have withdrawn from the event.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      setWithdrawing(false);
    }
  };

  const onDeleteEventLike = async () => {
    if (isLiking || isUnliking) {
      return;
    }

    try {
      setUnliking(true);
      const { event: updatedEvent } = await deleteEventLike({ eventId: id });

      await onChange?.({ ...updatedEvent });

      toast.success("You have unliked the event.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      setUnliking(false);
    }
  };

  const onUserClick = () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${creator.id}`));

  const onViewDetails = () =>
    history.push(EVENTS_SINGLE_VIEW_PATH.replace(`:${EVENT_ID}`, `${id}`));

  return (
    <div className={styles.eventSummaryCard}>
      <div className={styles.meta}>
        <div className={styles.userInfo}>
          <ProgressiveImage
            src={creator.profileImageUrl || defaultAvatarImage}
            placeholder={placeholderImage}
          >
            {(src: string) => (
              // eslint-disable-next-line
              <img
                onClick={onUserClick}
                className={classNames(
                  "ui mini avatar bordered image",
                  styles.pointer,
                )}
                src={src}
                alt=""
              />
            )}
          </ProgressiveImage>
          <strong
            onClick={onUserClick}
            className={classNames(styles.name, styles.pointer)}
          >
            {creator.name}
          </strong>
        </div>

        {category && (
          <Label className={styles.category} basic circular>
            {category}
          </Label>
        )}
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            <h1>{title}</h1>
          </div>

          <div className={styles.dateTime}>
            <Icon name="clock outline" />
            {`${displayDateTime(startDateTime)} - ${displayDateTime(
              endDateTime,
            )}`}
          </div>

          <div className={styles.description}>
            <LinkifyTextViewer>{description}</LinkifyTextViewer>
          </div>

          <div className={styles.extra}>
            <div className={styles.pointer}>
              {hasSignedUp ? (
                <Popup
                  content="Withdraw"
                  position="top center"
                  trigger={
                    <div
                      onClick={onDeleteEventSignUp}
                      className={styles.signedUp}
                    >
                      {isWithdrawing ? (
                        <IconLoader className={styles.loader} />
                      ) : (
                        <Icon className={styles.icon} name="check" />
                      )}
                      I am going!
                    </div>
                  }
                />
              ) : (
                <Popup
                  content="Join"
                  position="top center"
                  trigger={
                    <div
                      onClick={onCreateEventSignUp}
                      className={styles.notSignedUp}
                    >
                      {isSigningUp ? (
                        <IconLoader className={styles.loader} />
                      ) : (
                        <Icon name="check" />
                      )}
                      {signUpCount} Going
                    </div>
                  }
                />
              )}
            </div>

            <div className={styles.pointer}>
              {hasLiked ? (
                <Popup
                  content="Unlike"
                  position="top center"
                  trigger={
                    <div onClick={onDeleteEventLike} className={styles.liked}>
                      {isUnliking ? (
                        <IconLoader className={styles.loader} />
                      ) : (
                        <Icon className={styles.icon} name="heart" />
                      )}
                      I like it
                    </div>
                  }
                />
              ) : (
                <Popup
                  content="Like"
                  position="top center"
                  trigger={
                    <div
                      onClick={onCreateEventLike}
                      className={styles.notLiked}
                    >
                      {isLiking ? (
                        <IconLoader className={styles.loader} />
                      ) : (
                        <Icon name="heart outline" />
                      )}
                      {likeCount} Likes
                    </div>
                  }
                />
              )}
            </div>

            <div onClick={onViewDetails}>
              <Label
                as="a"
                circular
                content="View details"
                basic
                color="blue"
              />
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div>
            <Image rounded size="small" wrapped bordered>
              <ProgressiveImage src={images[0]} placeholder={placeholderImage}>
                {(src: string) => <img src={src} alt="" />}
              </ProgressiveImage>
            </Image>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(EventSummaryCard);
