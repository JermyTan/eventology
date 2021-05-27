import { useState } from "react";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { toast } from "react-toastify";
import { Icon } from "semantic-ui-react";
import IconLoader from "../icon-loader";
import { resolveApiError } from "../../utils/error-utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  useCreateEventSignUp,
  useCreateEventLike,
  useDeleteEventSignUp,
  useDeleteEventLike,
  useGetSingleEvent,
} from "../../custom-hooks/api/events-api";
import { setEvent } from "../../redux/slices/single-event-slice";
import styles from "./event-action-buttons.module.scss";

type Props = {
  onClickComment: () => void;
};

function EventActionButtons({ onClickComment }: Props) {
  const {
    id: eventId,
    hasLiked,
    hasSignedUp,
  } = useAppSelector(
    ({ singleEvent: { event: { id, hasSignedUp, hasLiked } = {} } }) => ({
      id,
      hasLiked,
      hasSignedUp,
    }),
    isEqual,
  ) as { id: number; hasLiked: boolean; hasSignedUp: boolean };
  const dispatch = useAppDispatch();

  const { getSingleEvent } = useGetSingleEvent();
  const { createEventSignUp } = useCreateEventSignUp();
  const { createEventLike } = useCreateEventLike();
  const { deleteEventSignUp } = useDeleteEventSignUp();
  const { deleteEventLike } = useDeleteEventLike();
  const [isSigningUp, setSigningUp] = useState(false);
  const [isLiking, setLiking] = useState(false);
  const [isWithdrawing, setWithdrawing] = useState(false);
  const [isUnliking, setUnliking] = useState(false);

  const updateEvent = async (
    updateFunction: (data: { eventId: number }) => Promise<unknown>,
  ) => {
    await updateFunction({ eventId });
    const updatedEvent = await getSingleEvent(eventId);
    dispatch(setEvent(updatedEvent));
  };

  const onCreateEventSignUp = async () => {
    if (isSigningUp || isWithdrawing) {
      return;
    }

    try {
      setSigningUp(true);

      await updateEvent(createEventSignUp);

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

      await updateEvent(createEventLike);

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

      await updateEvent(deleteEventSignUp);

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

      await updateEvent(deleteEventLike);

      toast.success("You have unliked the event.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      setUnliking(false);
    }
  };

  return (
    <>
      <div className={styles.commentAndLikeButtonContainer}>
        <div
          onClick={onClickComment}
          className={classNames(styles.commentIconContainer, styles.pointer)}
        >
          <i className="far fa-comment-dots icon fitted big" />
        </div>

        {isUnliking || isLiking ? (
          <IconLoader className={styles.loader} size="big" />
        ) : (
          <div
            onClick={hasLiked ? onDeleteEventLike : onCreateEventLike}
            className={classNames(
              hasLiked ? styles.liked : styles.unliked,
              styles.pointer,
            )}
          >
            <Icon
              name={hasLiked ? "heart" : "heart outline"}
              size="big"
              fitted
            />
          </div>
        )}
      </div>

      <div
        onClick={hasSignedUp ? onDeleteEventSignUp : onCreateEventSignUp}
        className={classNames(
          styles.joinButton,
          styles.important,
          styles.pointer,
        )}
      >
        {isWithdrawing || isSigningUp ? (
          <IconLoader className={styles.loader} size="big" />
        ) : (
          <div
            className={classNames(
              styles.labelContainer,
              hasSignedUp ? styles.signedUp : styles.notSignedUp,
            )}
          >
            <Icon className={styles.icon} name="check" size="big" />
            <h4 className={styles.text}>
              {hasSignedUp ? "I am going" : "Join"}
            </h4>
          </div>
        )}
      </div>
    </>
  );
}

export default EventActionButtons;
