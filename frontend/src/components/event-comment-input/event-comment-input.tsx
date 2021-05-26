import classNames from "classnames";
import { Image, Input } from "semantic-ui-react";
import { useContext, useState } from "react";
import { SingleEventContext } from "../../context-providers";
import IconLoader from "../icon-loader";
import styles from "./event-comment-input.module.scss";
import sendLogo from "../../assets/send-purple.svg";

type Props = {
  onClickCancel: () => void;
};

function EventCommentInput({ onClickCancel }: Props) {
  const { createEventComment, inputComment, setInputComment } =
    useContext(SingleEventContext);
  const [isSending, setSending] = useState(false);

  const onSend = async () => {
    if (!inputComment) {
      return;
    }

    setSending(true);
    await createEventComment({ content: inputComment });
    setSending(false);
    setInputComment("");
  };

  return (
    <>
      <div className={styles.inputContainer}>
        <div
          onClick={onClickCancel}
          className={classNames(styles.iconContainer, styles.pointer)}
        >
          <i className="fal fa-times icon fitted big" />
        </div>

        <Input
          placeholder="Leave your comment here"
          className={styles.roundedInput}
          onChange={(_, { value }) => setInputComment(value)}
          value={inputComment}
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
