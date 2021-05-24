import classNames from "classnames";
import { Icon } from "semantic-ui-react";
import styles from "./event-action-buttons.module.scss";

type Props = {
  onClickComment: () => void;
};

function EventActionButtons({ onClickComment }: Props) {
  return (
    <>
      <div className={styles.commentAndLikeButtonContainer}>
        <div className={classNames(styles.iconContainer, styles.pointer)}>
          <i
            onClick={onClickComment}
            className="far fa-comment-dots icon fitted big"
          />
        </div>

        <div className={classNames(styles.iconContainer, styles.pointer)}>
          <Icon name="heart outline" size="big" fitted />
        </div>
      </div>

      <div
        className={classNames(
          styles.joinButton,
          styles.important,
          styles.pointer,
        )}
      >
        <Icon className={styles.icon} name="check" size="big" />
        <h4 className={styles.text}>Join</h4>
      </div>
    </>
  );
}

export default EventActionButtons;
