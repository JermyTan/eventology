import { Image } from "semantic-ui-react";
import noActivityLogo from "../../assets/no-activity-purple.svg";
import styles from "./no-event-banner.module.scss";

function NoEventBanner() {
  return (
    <div className={styles.noEventContentContainer}>
      <Image src={noActivityLogo} size="tiny" wrapped />
      <h3 className={styles.text}>No event found</h3>
    </div>
  );
}

export default NoEventBanner;
