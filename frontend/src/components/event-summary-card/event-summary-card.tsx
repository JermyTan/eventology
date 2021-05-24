import { useMemo } from "react";
import { Image, Label, Icon, Popup } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { EventData } from "../../types/events";
import { displayDateTime } from "../../utils/parser-utils";
import LinkifyTextViewer from "../linkify-text-viewer";
import {
  useCreateEventSignUp,
  useCreateEventLike,
  useDeleteEventSignUps,
  useDeleteEventLikes,
} from "../../custom-hooks/api/events-api";
import IconLoader from "../icon-loader/icon-loader";
import { resolveApiError } from "../../utils/error-utils";
import { EVENTS_SINGLE_VIEW_PATH, PROFILE_MAIN_PATH } from "../../routes/paths";
import { EVENT_ID, USER_ID } from "../../constants";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-summary-card.module.scss";

type Props = {
  event: EventData;
  onChange?: (changes: Partial<EventData>) => void;
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
  const { createEventSignUp, isLoading: isSigningUp } = useCreateEventSignUp();
  const { createEventLike, isLoading: isLiking } = useCreateEventLike();
  const { deleteEventSignUps, isLoading: isWithdrawing } =
    useDeleteEventSignUps();
  const { deleteEventLikes, isLoading: isUnliking } = useDeleteEventLikes();
  const history = useHistory();

  const {
    onCreateEventSignUp,
    onCreateEventLike,
    onDeleteEventSignUp,
    onDeleteEventLike,
  } = useMemo(() => {
    const onCreateEventSignUp = async () => {
      try {
        const { event: updatedEvent } = await createEventSignUp({
          eventId: id,
        });

        onChange?.({ ...updatedEvent });

        toast.success("You have joined for the event.");
      } catch (error) {
        resolveApiError(error);
      }
    };

    const onCreateEventLike = async () => {
      try {
        const { event: updatedEvent } = await createEventLike({ eventId: id });

        onChange?.({ ...updatedEvent });

        toast.success("You have liked the event.");
      } catch (error) {
        resolveApiError(error);
      }
    };

    const onDeleteEventSignUp = async () => {
      try {
        const { event: updatedEvent } = await deleteEventSignUps({
          eventId: id,
        });

        onChange?.({ ...updatedEvent });

        toast.success("You have withdrawn from the event.");
      } catch (error) {
        resolveApiError(error);
      }
    };

    const onDeleteEventLike = async () => {
      try {
        const { event: updatedEvent } = await deleteEventLikes({ eventId: id });

        onChange?.({ ...updatedEvent });

        toast.success("You have unliked the event.");
      } catch (error) {
        resolveApiError(error);
      }
    };

    return {
      onCreateEventSignUp,
      onCreateEventLike,
      onDeleteEventSignUp,
      onDeleteEventLike,
    };
  }, [
    id,
    onChange,
    createEventSignUp,
    createEventLike,
    deleteEventSignUps,
    deleteEventLikes,
  ]);

  const onUserClick = () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${creator.id}`));

  const onViewDetails = () =>
    history.push(EVENTS_SINGLE_VIEW_PATH.replace(`:${EVENT_ID}`, `${id}`));

  return (
    <div className={styles.eventSummaryCard}>
      <div className={styles.meta}>
        <div className={styles.userInfo}>
          <Image
            onClick={onUserClick}
            className={styles.pointer}
            src={defaultAvatarImage}
            alt=""
            avatar
            bordered
            size="mini"
          />
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

      <div className={styles.title}>
        <h1>{title}</h1>
      </div>

      <div className={styles.dateTime}>
        <Icon name="clock outline" />
        {`${displayDateTime(startDateTime)} - ${displayDateTime(endDateTime)}`}
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
                <div onClick={onDeleteEventSignUp} className={styles.signedUp}>
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
                <div onClick={onCreateEventLike} className={styles.notLiked}>
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
          <Label as="a" circular content="View details" basic color="blue" />
        </div>
      </div>
    </div>
  );
}

export default EventSummaryCard;
