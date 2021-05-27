import classNames from "classnames";
import { Image, Input } from "semantic-ui-react";
import { useState } from "react";
import IconLoader from "../icon-loader";
import styles from "./event-comment-input.module.scss";
import sendLogo from "../../assets/send-purple.svg";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setEvent,
  setInputComment,
} from "../../redux/slices/single-event-slice";
import {
  useCreateEventComment,
  useGetSingleEvent,
} from "../../custom-hooks/api/events-api";

type Props = {
  onClickCancel: () => void;
};

function EventCommentInput({ onClickCancel }: Props) {
  const inputComment = useAppSelector(
    ({ singleEvent }) => singleEvent.inputComment,
  );
  const eventId = useAppSelector(
    ({ singleEvent }) => singleEvent.event?.id,
  ) as number;
  const dispatch = useAppDispatch();

  const { getSingleEvent } = useGetSingleEvent();
  const { createEventComment } = useCreateEventComment();
  const [isSending, setSending] = useState(false);

  const onSend = async () => {
    if (!inputComment) {
      return;
    }

    setSending(true);
    await createEventComment({ eventId, content: inputComment });
    dispatch(setEvent(await getSingleEvent(eventId)));
    setSending(false);
    dispatch(setInputComment(""));
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
          onChange={(_, { value }) => dispatch(setInputComment(value))}
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
