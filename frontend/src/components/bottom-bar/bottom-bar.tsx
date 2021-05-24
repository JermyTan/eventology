import { Transition } from "semantic-ui-react";
import { useEffect, useState } from "react";
import styles from "./bottom-bar.module.scss";
import EventActionButtons from "../event-action-buttons";
import EventCommentInput from "../event-comment-input";

function BottomBar() {
  const [isMounted, setMounted] = useState(false);
  const [isCommenting, setCommenting] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return (
    <Transition unmountOnHide visible={isMounted} animation="slide up">
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
