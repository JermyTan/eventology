import { Transition } from "semantic-ui-react";
import { useContext, useState } from "react";
import styles from "./bottom-bar.module.scss";
import EventActionButtons from "../event-action-buttons";
import EventCommentInput from "../event-comment-input";
import { SingleEventContext } from "../../context-providers";

function BottomBar() {
  const { event } = useContext(SingleEventContext);
  const [isCommenting, setCommenting] = useState(false);

  return (
    <Transition
      unmountOnHide
      visible={event !== undefined}
      animation="slide up"
    >
      <div className={styles.bottomBar}>
        <div className={styles.actionsContainer}>
          {isCommenting ? (
            <EventCommentInput onClickCancel={() => setCommenting(false)} />
          ) : (
            <EventActionButtons onClickComment={() => setCommenting(true)} />
          )}
        </div>
      </div>
    </Transition>
  );
}

export default BottomBar;
