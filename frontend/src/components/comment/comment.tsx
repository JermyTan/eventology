import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { Image } from "semantic-ui-react";
import LinkifyTextViewer from "../linkify-text-viewer";
import { displayDateTime } from "../../utils/parser-utils";
import { RELATIVE, USER_ID } from "../../constants";
import { PROFILE_MAIN_PATH } from "../../routes/paths";
import { EventCommentData } from "../../types/events";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./comment.module.scss";
import { useState } from "react";

type Props = {
  comment: EventCommentData;
};

function Comment({
  comment: {
    user: { id: userId, name },
    createdAt,
    content,
  },
}: Props) {
  const history = useHistory();
  const [isHoveringReply, setHoveringReply] = useState(false);

  const onUserClick = () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${userId}`));

  return (
    <div className={styles.comment}>
      <Image
        onClick={onUserClick}
        src={defaultAvatarImage}
        alt=""
        avatar
        bordered
        size="mini"
        className={styles.pointer}
      />

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

export default Comment;
