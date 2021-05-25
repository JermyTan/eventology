import classNames from "classnames";
import { Image, Input, InputOnChangeData } from "semantic-ui-react";
import { useCallback, useState } from "react";
import styles from "./event-comment-input.module.scss";
import sendLogo from "../../assets/send-purple.svg";
import { useCreateEventComment } from "../../custom-hooks/api/events-api";

type Props = {
  onClickCancel: () => void;
};

function EventCommentInput({ onClickCancel }: Props) {
  const [comment, setComment] = useState("");

  const onCommentChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
      setComment(value);
    },
    [],
  );

  return (
    <>
      <div className={styles.inputContainer}>
        <div className={classNames(styles.iconContainer, styles.pointer)}>
          <i onClick={onClickCancel} className="fal fa-times icon fitted big" />
        </div>

        <Input
          placeholder="Leave your comment here"
          className={styles.roundedInput}
          onChange={onCommentChange}
          value={comment}
        />
      </div>

      <div className={classNames(styles.sendButton, styles.pointer)}>
        <Image src={sendLogo} alt="Send" size="mini" />
      </div>
    </>
  );
}

export default EventCommentInput;
