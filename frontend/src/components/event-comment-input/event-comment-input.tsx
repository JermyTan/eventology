import classNames from "classnames";
import { Image, Input } from "semantic-ui-react";
import { useContext, useState } from "react";
import styles from "./event-comment-input.module.scss";
import sendLogo from "../../assets/send-purple.svg";
import { SingleEventContext } from "../../context-providers";
import IconLoader from "../icon-loader/icon-loader";

type Props = {
  onClickCancel: () => void;
};

function EventCommentInput({ onClickCancel }: Props) {
  const { createEventComment } = useContext(SingleEventContext);
  const [comment, setComment] = useState("");
  const [isSending, setSending] = useState(false);

  const onSend = async () => {
    if (!comment) {
      return;
    }

    setSending(true);
    await createEventComment(comment);
    setSending(false);
    setComment("");
  };

  return (
    <>
      <div className={styles.inputContainer}>
        <div className={classNames(styles.iconContainer, styles.pointer)}>
          <i onClick={onClickCancel} className="fal fa-times icon fitted big" />
        </div>

        <Input
          placeholder="Leave your comment here"
          className={styles.roundedInput}
          onChange={(_, { value }) => setComment(value)}
          value={comment}
        />
      </div>

      <div
        onClick={onSend}
        className={classNames(styles.sendButton, styles.pointer)}
      >
        {isSending ? (
          <IconLoader className={styles.loader} size="big" />
        ) : (
          <Image src={sendLogo} alt="Send" size="mini" />
        )}
      </div>
    </>
  );
}

export default EventCommentInput;
