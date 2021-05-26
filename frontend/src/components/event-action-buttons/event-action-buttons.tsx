import { useContext, useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import { Icon } from "semantic-ui-react";
import IconLoader from "../icon-loader";
import { SingleEventContext } from "../../context-providers";
import { resolveApiError } from "../../utils/error-utils";
import styles from "./event-action-buttons.module.scss";

type Props = {
  onClickComment: () => void;
};

function EventActionButtons({ onClickComment }: Props) {
  const {
    event: { hasLiked, hasSignedUp } = { hasLiked: false, hasSignedUp: false },
    createEventSignUp,
    createEventLike,
    deleteEventSignUp,
    deleteEventLike,
  } = useContext(SingleEventContext);
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

      await createEventSignUp();

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

      await createEventLike();

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

      await deleteEventSignUp();

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

      await deleteEventLike();

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
