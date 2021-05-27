import { Transition } from "semantic-ui-react";
import isEqual from "lodash.isequal";
import styles from "./bottom-bar.module.scss";
import EventActionButtons from "../event-action-buttons";
import EventCommentInput from "../event-comment-input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCommenting } from "../../redux/slices/single-event-slice";

function BottomBar() {
  const { event, isCommenting } = useAppSelector(
    ({ singleEvent: { event, isCommenting } }) => ({ event, isCommenting }),
    isEqual,
  );
  const dispatch = useAppDispatch();

  return (
    <Transition
      unmountOnHide
      visible={event !== undefined}
      animation="slide up"
    >
      <div className={styles.bottomBar}>
        <div className={styles.actionsContainer}>
          {isCommenting ? (
            <EventCommentInput
              onClickCancel={() => dispatch(setCommenting(false))}
            />
          ) : (
            <EventActionButtons
              onClickComment={() => dispatch(setCommenting(true))}
            />
          )}
        </div>
      </div>
    </Transition>
  );
}

export default BottomBar;
