import { memo, useState } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import ProgressiveImage from "react-progressive-graceful-image";
import LinkifyTextViewer from "../linkify-text-viewer";
import { displayDateTime } from "../../utils/parser-utils";
import { RELATIVE, USER_ID } from "../../constants";
import { PROFILE_MAIN_PATH } from "../../routes/paths";
import { EventCommentData } from "../../types/events";
import placeholderImage from "../../assets/placeholder-image.gif";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./comment.module.scss";
import { useAppDispatch } from "../../redux/hooks";
import { setReplyComment } from "../../redux/slices/single-event-slice";

type Props = {
  comment: EventCommentData;
};

function Comment({
  comment: {
    user: { id: userId, name, profileImageUrl },
    createdAt,
    content,
  },
}: Props) {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [isHoveringReply, setHoveringReply] = useState(false);

  const onUserClick = () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${userId}`));

  const onReplyClick = () => dispatch(setReplyComment({ name }));

  return (
    <div className={styles.comment}>
      <ProgressiveImage
        src={profileImageUrl || defaultAvatarImage}
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

      <div className={styles.textContainer}>
        <div className={styles.info}>
          <div
            onClick={onUserClick}
            className={classNames(styles.name, styles.pointer)}
          >
            {name}
          </div>

          <div className={styles.postedDateTime}>
            {displayDateTime(createdAt, RELATIVE)}
          </div>
        </div>

        <div className={styles.content}>
          <LinkifyTextViewer>{content}</LinkifyTextViewer>
        </div>
      </div>

      <div
        onClick={onReplyClick}
        onMouseEnter={() => setHoveringReply(true)}
        onMouseLeave={() => setHoveringReply(false)}
        className={classNames(styles.replyIconContainer, styles.pointer)}
      >
        {isHoveringReply ? (
          <i className="fas fa-reply icon" />
        ) : (
          <i className="far fa-reply icon" />
        )}
      </div>
    </div>
  );
}

export default memo(Comment);
