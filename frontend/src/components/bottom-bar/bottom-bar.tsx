import { Transition, Icon } from "semantic-ui-react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./bottom-bar.module.scss";

function BottomBar() {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return (
    <Transition unmountOnHide visible={isMounted} animation="slide up">
      <div className={styles.bottomBar}>
        <div className={styles.actionsContainer}>
          <div className={styles.commentAndLikeButtonContainer}>
            <div className={classNames(styles.iconContainer, styles.pointer)}>
              <i className="far fa-comment-dots icon large" />
            </div>

            <div className={classNames(styles.iconContainer, styles.pointer)}>
              <Icon name="heart outline" size="large" />
            </div>
          </div>

          <div className={classNames(styles.joinButton, styles.pointer)}>
            <Icon className={styles.icon} name="check" size="large" />
            <h4 className={styles.text}>Join</h4>
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default BottomBar;
